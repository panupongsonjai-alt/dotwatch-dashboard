import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { database } from "./firebase";
import "./App.css";

function App() {
  const [sensor, setSensor] = useState({
    temperature: "-",
    humidity: "-",
    status: "-",
  });

  const [relays, setRelays] = useState({
    relay1: false,
    relay2: false,
    relay3: false,
    relay4: false,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const sensorRef = ref(database, "sensor");

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setSensor({
          temperature: data.temperature ?? "-",
          humidity: data.humidity ?? "-",
          status: data.status ?? "-",
        });

        const now = new Date().toLocaleTimeString();

        setChartData((prev) => {
          const newData = [
            ...prev,
            {
              time: now,
              temperature: Number(data.temperature) || 0,
              humidity: Number(data.humidity) || 0,
            },
          ];

          return newData.slice(-10);
        });
      }
    });

    const controlRef = ref(database, "control");

    const unsubscribeControl = onValue(controlRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setRelays({
          relay1: data.relay1 === true,
          relay2: data.relay2 === true,
          relay3: data.relay3 === true,
          relay4: data.relay4 === true,
        });
      }
    });

    return () => {
      unsubscribeSensor();
      unsubscribeControl();
    };
  }, []);

  const toggleRelay = async (relayName) => {
    const newState = !relays[relayName];
    await set(ref(database, `control/${relayName}`), newState);
  };

  return (
    <div className="page">
      <h1>dotWatch IoT Dashboard</h1>

      <div className="grid">
        <div className="card">
          <p>Temperature</p>
          <h2>{sensor.temperature} °C</h2>
        </div>

        <div className="card">
          <p>Humidity</p>
          <h2>{sensor.humidity} %</h2>
        </div>

        <div className="card">
          <p>Status</p>
          <h2>{sensor.status}</h2>
        </div>

        {Object.keys(relays).map((relayName, index) => (
          <div className="card" key={relayName}>
            <p>Relay {index + 1}</p>
            <button
              className={relays[relayName] ? "btn-on" : "btn-off"}
              onClick={() => toggleRelay(relayName)}
            >
              {relays[relayName] ? "ON" : "OFF"}
            </button>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <h2>Temperature & Humidity Realtime Chart</h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={3}
              name="Temperature °C"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Humidity %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebase";
import "./App.css";

function App() {
  const [sensor, setSensor] = useState({
    temperature: "-",
    humidity: "-",
    status: "-",
  });

  const [relay1, setRelay1] = useState(false);

  useEffect(() => {
    const sensorRef = ref(database, "sensor");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setSensor({
          temperature: data.temperature ?? "-",
          humidity: data.humidity ?? "-",
          status: data.status ?? "-",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleRelay = async () => {
    const newState = !relay1;
    setRelay1(newState);
    await set(ref(database, "control/relay1"), newState);
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

        <div className="card">
          <p>Relay 1</p>
          <button onClick={toggleRelay}>
            {relay1 ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
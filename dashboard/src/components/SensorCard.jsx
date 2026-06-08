function SensorCard({ title, value, unit }) {
  return (
    <div className="card">
      <p>{title}</p>
      <h2>
        {value} {unit}
      </h2>
    </div>
  );
}

export default SensorCard;
import { formatDistance, formatFuel } from "../units";

// Duration, distance and fuel cards (the lab's trip summary, formatted).
export default function TripSummary({ route, metric }) {
  return (
    <div className="summary">
      <div className="stat">
        <span className="label">Trip Duration</span>
        <span className="value">{route.duration}</span>
      </div>
      <div className="stat">
        <span className="label">Distance</span>
        <span className="value">
          {formatDistance(route.distance_miles, metric)}
        </span>
      </div>
      <div className="stat">
        <span className="label">Fuel Used</span>
        <span className="value">{formatFuel(route.fuel_gallons, metric)}</span>
      </div>
    </div>
  );
}

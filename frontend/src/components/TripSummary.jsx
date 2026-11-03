import { formatDistance, formatFuel } from "../units";
import { routeTypeLabel, usesFuel } from "../routeTypes";

// Route type, duration, distance and fuel cards (the lab's trip summary, formatted).
export default function TripSummary({ route, metric }) {
  return (
    <div className="summary">
      <div className="stat">
        <span className="label">Route Type</span>
        <span className="value">{routeTypeLabel(route.route_type)}</span>
      </div>
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
        <span className="value">
          {usesFuel(route.route_type)
            ? formatFuel(route.fuel_gallons, metric)
            : "No fuel needed"}
        </span>
      </div>
    </div>
  );
}

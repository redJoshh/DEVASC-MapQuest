import { formatDistance } from "../units";
import { routeTypeLabel } from "../routeTypes";

// Route type, duration and distance cards (the lab's trip summary, formatted).
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
    </div>
  );
}

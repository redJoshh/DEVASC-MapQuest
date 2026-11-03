import { formatDistance } from "../units";

// Step-by-step maneuvers (the lab's for-loop over legs[0].maneuvers) as a table.
export default function DirectionsTable({ maneuvers, metric }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Directions</th>
            <th className="num">Distance</th>
          </tr>
        </thead>
        <tbody>
          {maneuvers.map((m, i) => (
            <tr key={i}>
              <td className="step">{String(i + 1).padStart(2, "0")}</td>
              <td>{m.narrative}</td>
              <td className="nowrap num">
                {formatDistance(m.distance_miles, metric)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

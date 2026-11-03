import { useState } from "react";
import { fetchRoute } from "./api";
import RouteForm from "./components/RouteForm";
import UnitToggle from "./components/UnitToggle";
import TripSummary from "./components/TripSummary";
import DirectionsTable from "./components/DirectionsTable";
import "./App.css";

// Top-level state: the current route, any alert message, loading flag, and units.
export default function App() {
  const [route, setRoute] = useState(null);
  const [alert, setAlert] = useState(null); // { text, level: 'error' | 'warning' }
  const [loading, setLoading] = useState(false);
  const [metric, setMetric] = useState(true); // the lab displayed metric by default

  async function handleSearch(orig, dest) {
    setAlert(null);
    setRoute(null);
    setLoading(true);
    try {
      setRoute(await fetchRoute(orig, dest)); // Test Case 1
    } catch (err) {
      // Test Case 4 (invalid location) and Test Case 5 (backend down)
      setAlert({ text: err.message, level: err.level || "error" });
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setRoute(null);
    setAlert(null);
  }

  return (
    <main className="container">
      <h1>MapQuest Directions</h1>

      <RouteForm
        loading={loading}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {alert && (
        <div className={`alert ${alert.level}`} role="alert">
          {alert.text}
        </div>
      )}

      {route && (
        <section className="results">
          <div className="success">Route found</div>
          <div className="results-header">
            <h2>
              {route.origin} &rarr; {route.destination}
            </h2>
            <UnitToggle metric={metric} onChange={setMetric} />
          </div>
          <TripSummary route={route} metric={metric} />
          <DirectionsTable maneuvers={route.maneuvers} metric={metric} />
        </section>
      )}
    </main>
  );
}

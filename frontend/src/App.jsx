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
  const [metric, setMetric] = useState(true); // true = km, false = miles

  async function handleSearch(orig, dest, routeType) {
    setAlert(null);
    setRoute(null);
    setLoading(true);
    try {
      setRoute(await fetchRoute(orig, dest, routeType));
    } catch (err) {
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
    <div className="page">
      <section className="hero">
        <header className="masthead">
          <h1 className="wordmark">ROUTE</h1>
          <p className="byline">by: Atienza, Cabillo, Mortiz, Naguimbing</p>
        </header>

        <p className="tagline">
          Find the way from where you are
          <br />
          to wherever you&rsquo;re headed.
        </p>

        <div className="hero-panel">
          <RouteForm
            loading={loading}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>

        <aside className="hero-tab">
          <span className="tab-icon" aria-hidden="true">
            &#8597;
          </span>
          <div>
            <span className="tab-title">Units</span>
            <UnitToggle metric={metric} onChange={setMetric} />
          </div>
        </aside>
      </section>

      {(alert || route) && (
        <section className="results">
          {alert && (
            <div className={`alert ${alert.level}`} role="alert">
              {alert.text}
            </div>
          )}

          {route && (
            <>
              <div className="results-header">
                <span className="eyebrow success">Route found</span>
                <h2>
                  {route.origin} <span className="arrow">&rarr;</span>{" "}
                  {route.destination}
                </h2>
              </div>
              <TripSummary route={route} metric={metric} />
              <DirectionsTable maneuvers={route.maneuvers} metric={metric} />
            </>
          )}
        </section>
      )}
    </div>
  );
}

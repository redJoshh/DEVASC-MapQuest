import { useState } from "react";
import { ROUTE_TYPES, DEFAULT_ROUTE_TYPE } from "../routeTypes";

// Start/destination inputs with empty-field validation (Test Case 3),
// a route type picker, plus swap and clear buttons.
export default function RouteForm({ loading, onSearch, onClear }) {
  const [orig, setOrig] = useState("");
  const [dest, setDest] = useState("");
  const [routeType, setRouteType] = useState(DEFAULT_ROUTE_TYPE);
  const [fieldError, setFieldError] = useState({ orig: false, dest: false });

  function handleSubmit(e) {
    e.preventDefault();
    const errs = { orig: !orig.trim(), dest: !dest.trim() };
    setFieldError(errs);
    if (errs.orig || errs.dest) return; // nothing is sent to the backend
    onSearch(orig.trim(), dest.trim(), routeType);
  }

  function handleSwap() {
    setOrig(dest);
    setDest(orig);
  }

  function handleClear() {
    setOrig("");
    setDest("");
    setRouteType(DEFAULT_ROUTE_TYPE);
    setFieldError({ orig: false, dest: false });
    onClear();
  }

  return (
    <form className="route-form" onSubmit={handleSubmit} noValidate>
      <div className="fields">
        <label className="field">
          <span className="field-index">01</span>
          <span className="field-body">
            <span className="field-label">From</span>
            <input
              type="text"
              aria-label="Starting location"
              className={fieldError.orig ? "invalid" : ""}
              placeholder="Washington, D.C."
              value={orig}
              onChange={(e) => {
                setOrig(e.target.value);
                setFieldError((f) => ({ ...f, orig: false }));
              }}
            />
          </span>
        </label>

        <button
          type="button"
          className="swap"
          onClick={handleSwap}
          title="Swap locations"
          aria-label="Swap locations"
        >
          &#8644;
        </button>

        <label className="field">
          <span className="field-index">02</span>
          <span className="field-body">
            <span className="field-label">To</span>
            <input
              type="text"
              aria-label="Destination"
              className={fieldError.dest ? "invalid" : ""}
              placeholder="Baltimore, Md"
              value={dest}
              onChange={(e) => {
                setDest(e.target.value);
                setFieldError((f) => ({ ...f, dest: false }));
              }}
            />
          </span>
        </label>
      </div>

      {(fieldError.orig || fieldError.dest) && (
        <p className="field-error">Please fill in both locations.</p>
      )}

      <div className="form-footer">
        <div className="toggle route-type" role="group" aria-label="Route type">
          {ROUTE_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={routeType === t.value ? "active" : ""}
              aria-pressed={routeType === t.value}
              onClick={() => setRouteType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="actions">
          <button type="button" className="secondary" onClick={handleClear}>
            Clear
          </button>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Loading..." : "Get Directions"}
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

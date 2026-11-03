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
    <form onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        aria-label="Starting location"
        className={fieldError.orig ? "invalid" : ""}
        placeholder="Starting location (e.g. Washington, D.C.)"
        value={orig}
        onChange={(e) => {
          setOrig(e.target.value);
          setFieldError((f) => ({ ...f, orig: false }));
        }}
      />
      <button
        type="button"
        className="swap"
        onClick={handleSwap}
        title="Swap locations"
      >
        &#8645; Swap
      </button>
      <input
        type="text"
        aria-label="Destination"
        className={fieldError.dest ? "invalid" : ""}
        placeholder="Destination (e.g. Baltimore, Md)"
        value={dest}
        onChange={(e) => {
          setDest(e.target.value);
          setFieldError((f) => ({ ...f, dest: false }));
        }}
      />

      {(fieldError.orig || fieldError.dest) && (
        <p className="field-error">Please fill in both locations.</p>
      )}

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
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Directions"}
        </button>
        <button type="button" className="secondary" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
}

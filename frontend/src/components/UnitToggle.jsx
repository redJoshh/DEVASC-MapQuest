// Two-option switch for Test Case 2. Changing it only re-renders;
// no new API request is made.
export default function UnitToggle({ metric, onChange }) {
  return (
    <div className="toggle" role="group" aria-label="Distance units">
      <button
        type="button"
        className={!metric ? "active" : ""}
        aria-pressed={!metric}
        onClick={() => onChange(false)}
      >
        Miles
      </button>
      <button
        type="button"
        className={metric ? "active" : ""}
        aria-pressed={metric}
        onClick={() => onChange(true)}
      >
        Kilometers
      </button>
    </div>
  );
}

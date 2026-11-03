// Rendering: every function here updates the page and nothing else.
//
// Rules for this file:
// - It never stores app state. main.js owns the state object and passes in
//   whatever a function needs, so the screen is always drawn from that state.
// - API data is untrusted (MapQuest narratives, and the origin/destination
//   echoed back from user input). It is only ever written with textContent or
//   createElement, never innerHTML, so text like "<img onerror=...>" shows up
//   as plain text instead of running as HTML.
// - Visual states are set through attributes (hidden, aria-invalid,
//   aria-pressed, data-level). The matching Tailwind classes are already in
//   index.html, so this file never adds or removes CSS classes.

import { formatDistance, formatFuel } from "./units.js";

// Look up each element once. Modules run after the HTML is parsed, so the
// elements already exist. main.js also uses these to attach event listeners.
export const els = {
  form: document.getElementById("route-form"),
  orig: document.getElementById("orig"),
  dest: document.getElementById("dest"),
  swapBtn: document.getElementById("swap-btn"),
  submitBtn: document.getElementById("submit-btn"),
  clearBtn: document.getElementById("clear-btn"),
  fieldError: document.getElementById("field-error"),
  alert: document.getElementById("alert"),
  results: document.getElementById("results"),
  heading: document.getElementById("route-heading"),
  unitToggle: document.getElementById("unit-toggle"),
  duration: document.getElementById("stat-duration"),
  distance: document.getElementById("stat-distance"),
  fuel: document.getElementById("stat-fuel"),
  directionsBody: document.getElementById("directions-body"),
};

// ---- Form -----------------------------------------------------------------

// errors = { orig: boolean, dest: boolean }
// aria-invalid turns the field red (Tailwind aria-invalid: variant) and tells
// screen readers the field has a problem. The single message shows when
// either field is empty (Test Case 3).
export function setFieldErrors(errors) {
  setInvalid(els.orig, errors.orig);
  setInvalid(els.dest, errors.dest);
  els.fieldError.hidden = !(errors.orig || errors.dest);
}

function setInvalid(input, invalid) {
  if (invalid) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}

// While a request runs, disable the button so it can't be sent twice.
// A disabled submit button also stops Enter from submitting the form.
export function setLoading(loading) {
  els.submitBtn.disabled = loading;
  els.submitBtn.textContent = loading ? "Loading..." : "Get Directions";
}

// ---- Alert ----------------------------------------------------------------

// level: "warning" -> yellow (HTTP 400), anything else -> red.
export function showAlert(text, level) {
  els.alert.textContent = text;
  els.alert.dataset.level = level;
  els.alert.hidden = false;
}

export function clearAlert() {
  els.alert.hidden = true;
  els.alert.textContent = "";
  delete els.alert.dataset.level;
}

// ---- Results --------------------------------------------------------------

// Draw the whole results section from the stored route.
// Called after a search AND when the units switch changes, which is why it
// takes `metric`: switching units just calls this again with the same route.
export function renderRoute(route, metric) {
  els.heading.textContent = `${route.origin} → ${route.destination}`;

  els.duration.textContent = route.duration;
  els.distance.textContent = formatDistance(route.distance_miles, metric);
  els.fuel.textContent = formatFuel(route.fuel_gallons, metric);

  renderDirections(route.maneuvers, metric);
  setUnitToggle(metric);
  els.results.hidden = false;
}

// One row per maneuver: step number, narrative, distance.
// The cells get no classes because the <tbody> in index.html styles them.
function renderDirections(maneuvers, metric) {
  const rows = maneuvers.map((m, i) => {
    const tr = document.createElement("tr");
    tr.append(
      cell(String(i + 1)),
      cell(m.narrative), // untrusted text: textContent only
      cell(formatDistance(m.distance_miles, metric)),
    );
    return tr;
  });
  // replaceChildren() removes the old rows and adds the new ones in one step.
  els.directionsBody.replaceChildren(...rows);
}

function cell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

// aria-pressed marks which unit is active, for screen readers and for the
// blue "active" style (Tailwind aria-pressed: variant).
export function setUnitToggle(metric) {
  for (const btn of els.unitToggle.querySelectorAll("button[data-metric]")) {
    const isMetricBtn = btn.dataset.metric === "true";
    btn.setAttribute("aria-pressed", String(isMetricBtn === metric));
  }
}

export function hideResults() {
  els.results.hidden = true;
  els.directionsBody.replaceChildren(); // drop old rows from the page
}

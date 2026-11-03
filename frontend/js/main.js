// Entry point: holds the app state and connects user actions to it.
//
// How the frontend is organized:
//   main.js  - state + event listeners (this file). The ONLY file that changes state.
//   ui.js    - draws the page from values it is given; stores nothing.
//   api.js   - the one fetch() call to the Flask backend.
//   units.js - miles/km and gallons/liters formatting.
//
// Each event handler follows the same pattern:
//   1. update `state`
//   2. call ui.js functions to show the new state
// With state in one place it's easy to see what the page is showing and why.
// To debug, add console.log(state) at the end of any handler below.

import { fetchRoute } from "./api.js";
import {
  els,
  setFieldErrors,
  setLoading,
  showAlert,
  clearAlert,
  renderRoute,
  setUnitToggle,
  hideResults,
} from "./ui.js";

const state = {
  route: null, // last successful API response, or null if no results shown
  metric: true, // kilometers by default, like the lab's metric output
  loading: false, // true while a request is in flight
  fieldErrors: { orig: false, dest: false }, // which inputs are empty on submit
};

// ---- Search (Test Cases 1, 3, 4, 5) -----------------------------------------

// "submit" fires for both the button click and Enter in either input,
// so one listener covers every way of searching.
els.form.addEventListener("submit", async (event) => {
  // Stop the browser's default form submit, which would reload the page.
  event.preventDefault();

  const orig = els.orig.value.trim();
  const dest = els.dest.value.trim();

  // Empty or whitespace-only fields: mark them and stop here, so no request
  // is ever sent to the backend (Test Case 3).
  state.fieldErrors = { orig: !orig, dest: !dest };
  setFieldErrors(state.fieldErrors);
  if (!orig || !dest) return;

  // Start each search from a clean page so an old route or old error
  // is never shown next to the new one.
  state.route = null;
  hideResults();
  clearAlert();
  state.loading = true;
  setLoading(true);

  try {
    state.route = await fetchRoute(orig, dest);
    renderRoute(state.route, state.metric);
  } catch (err) {
    // api.js turns every failure into { message, level } (Test Cases 4 and 5).
    showAlert(err.message, err.level || "error");
  } finally {
    state.loading = false;
    setLoading(false);
  }
});

// Typing in a field clears that field's error right away, so the red border
// goes as soon as the user starts fixing it.
for (const key of ["orig", "dest"]) {
  els[key].addEventListener("input", () => {
    state.fieldErrors = { ...state.fieldErrors, [key]: false };
    setFieldErrors(state.fieldErrors);
  });
}

// ---- Swap and Clear ---------------------------------------------------------

els.swapBtn.addEventListener("click", () => {
  [els.orig.value, els.dest.value] = [els.dest.value, els.orig.value];
});

// Clear resets the form, any error marks, the alert and the results.
// The units choice is kept on purpose: it's a user preference, not search data.
els.clearBtn.addEventListener("click", () => {
  els.orig.value = "";
  els.dest.value = "";
  state.fieldErrors = { orig: false, dest: false };
  setFieldErrors(state.fieldErrors);

  state.route = null;
  hideResults();
  clearAlert();
});

// ---- Units switch (Test Case 2) ---------------------------------------------

// One listener on the group handles both buttons ("event delegation").
// Switching units only re-renders the stored route: no new request is made.
els.unitToggle.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-metric]");
  if (!btn) return;

  state.metric = btn.dataset.metric === "true";
  setUnitToggle(state.metric);
  if (state.route) renderRoute(state.route, state.metric);
});

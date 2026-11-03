// Talks to our Flask backend only. The browser never calls MapQuest directly,
// so the API key never leaves the server.
//
// fetchRoute() either returns the route data or throws an Error with:
//   err.message -> text to show the user, as-is
//   err.level   -> "warning" (yellow alert) or "error" (red alert)
// Keeping every failure in this one shape means main.js needs a single
// try/catch and never has to know about HTTP status codes.

const SERVER_DOWN =
  "Cannot reach the server. Make sure the backend is running.";

function fail(text, level = "error") {
  const err = new Error(text);
  err.level = level; // 'error' (red) or 'warning' (yellow)
  return err;
}

export async function fetchRoute(orig, dest) {
  // URLSearchParams encodes spaces, commas and accents safely.
  const params = new URLSearchParams({ from: orig, to: dest });

  let res;
  try {
    // Relative URL: the page and the API come from the same Flask server
    // (same origin), so no proxy or CORS setup is needed.
    res = await fetch(`/api/route?${params}`);
  } catch {
    // fetch() only rejects when no HTTP response arrives at all, e.g. Flask
    // was stopped after the page loaded (Test Case 5).
    throw fail(SERVER_DOWN);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    // A response arrived but it isn't our JSON: something other than our
    // API answered (an HTML error page from a proxy, another app on the
    // port, etc.). For the user this means the same thing: no backend.
    throw fail(SERVER_DOWN);
  }

  if (!res.ok) {
    // 400 = missing input (warning); 422/500/502 = real errors.
    // The backend's message is shown unchanged so wording stays in one place.
    throw fail(
      data.error || "Something went wrong.",
      res.status === 400 ? "warning" : "error",
    );
  }
  return data;
}

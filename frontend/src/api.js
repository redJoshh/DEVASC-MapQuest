// Talks to our Flask backend only. The browser never calls MapQuest directly,
// so the API key never leaves the server.

const SERVER_DOWN =
  "Cannot reach the server. Make sure the backend is running.";

function fail(text, level = "error") {
  const err = new Error(text);
  err.level = level; // 'error' (red) or 'warning' (yellow)
  return err;
}

export async function fetchRoute(orig, dest) {
  const params = new URLSearchParams({ from: orig, to: dest });

  let res;
  try {
    res = await fetch(`/api/route?${params}`);
  } catch {
    throw fail(SERVER_DOWN); // network failure
  }

  let data;
  try {
    data = await res.json();
  } catch {
    // When Flask is stopped, Vite's proxy answers with an empty 500, not JSON
    throw fail(SERVER_DOWN);
  }

  if (!res.ok) {
    // 400 = missing input (warning); 422/500/502 = real errors
    throw fail(
      data.error || "Something went wrong.",
      res.status === 400 ? "warning" : "error",
    );
  }
  return data;
}

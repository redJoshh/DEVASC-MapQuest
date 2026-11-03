"""
MapQuest Directions API wrapper (Flask) that also serves the web page.

GET /                                     -> frontend/index.html
GET /<file>  (e.g. /js/main.js)           -> static files from frontend/
GET /api/route?from=<start>&to=<destination>

Keeps the lab's logic (statuscode 0 / 402 / 611 checks, maneuvers list) but
returns JSON for the frontend instead of printing to the console.
The API key stays on the server and is never sent to the browser, which is
also why we no longer print the request URL like the lab did (it contained the key).

Serving the page from Flask means the page and the API share one origin
(http://127.0.0.1:5000), so the browser needs no proxy and no CORS setup,
and the whole app runs from a single `python app.py`.
"""
import mimetypes
import os
import requests
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv

load_dotenv()

# Python's mimetypes reads file types from the Windows registry, where some
# installs map .js to "text/plain". Browsers refuse to run <script type="module">
# files with a non-JavaScript MIME type, so the page would load with no logic.
# Registering the type here forces the correct header on every OS.
mimetypes.add_type('text/javascript', '.js')

# Absolute path to frontend/, so the app works no matter which folder
# `python app.py` is started from.
FRONTEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'frontend')
)

# static_url_path='' serves frontend/ at the site root: frontend/js/main.js is
# available at /js/main.js. Flask checks fixed routes such as /api/route first,
# so the API is never shadowed by a static file.
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')

MAIN_API = 'https://www.mapquestapi.com/directions/v2/route'
KEY = os.getenv('MAPQUEST_KEY')

# The lab handled 402 and 611 explicitly; everything else gets a generic message.
ERROR_MESSAGES = {
    402: 'One or both locations could not be found. Try adding the city and state or country.',
    611: 'Please enter both a starting location and a destination.',
}


@app.get('/')
def index():
    # The static folder doesn't map "/" to index.html on its own, so this
    # route returns the page explicitly.
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.get('/api/route')
def get_route():
    orig = request.args.get('from', '').strip()
    dest = request.args.get('to', '').strip()

    # Missing input: stop before calling MapQuest at all (same idea as lab code 611)
    if not orig or not dest:
        return jsonify(error=ERROR_MESSAGES[611], statuscode=611), 400

    if not KEY:
        return jsonify(error='Server is missing the MapQuest API key (check backend/.env).'), 500

    try:
        resp = requests.get(
            MAIN_API,
            params={'key': KEY, 'from': orig, 'to': dest},  # requests URL-encodes this
            timeout=10,
        )
    except requests.RequestException:
        return jsonify(error='Could not reach MapQuest. Check your internet connection.'), 502

    # A wrong or unapproved key comes back as HTTP 401/403 with plain text, not JSON.
    # Without this check it would be misreported as "could not reach MapQuest".
    if resp.status_code in (401, 403):
        return jsonify(error='MapQuest rejected the API key. Check MAPQUEST_KEY in backend/.env.'), 500

    try:
        data = resp.json()
    except ValueError:
        return jsonify(error=f'MapQuest sent an unexpected response (HTTP {resp.status_code}).'), 502

    status = data.get('info', {}).get('statuscode')
    if status != 0:
        msg = ERROR_MESSAGES.get(status, f'MapQuest returned status code {status}.')
        return jsonify(error=msg, statuscode=status), 422

    route = data['route']
    # Send raw imperial values (MapQuest's default). The frontend converts them,
    # so the miles/km toggle works instantly with no new request.
    return jsonify(
        origin=orig,
        destination=dest,
        duration=route.get('formattedTime', 'N/A'),
        distance_miles=route.get('distance', 0),
        fuel_gallons=route.get('fuelUsed', 0),
        maneuvers=[
            {'narrative': m['narrative'], 'distance_miles': m['distance']}
            for m in route['legs'][0]['maneuvers']
        ],
    )


if __name__ == '__main__':
    app.run(debug=True, port=5000)
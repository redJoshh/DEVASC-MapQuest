"""
MapQuest Directions API wrapper (Flask).

GET /api/route?from=<start>&to=<destination>

Keeps the lab's logic (statuscode 0 / 402 / 611 checks, maneuvers list) but
returns JSON for the React frontend instead of printing to the console.
The API key stays on the server and is never sent to the browser, which is
also why we no longer print the request URL like the lab did (it contained the key).
"""
import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

MAIN_API = 'https://www.mapquestapi.com/directions/v2/route'
KEY = os.getenv('MAPQUEST_KEY')

# The lab handled 402 and 611 explicitly; everything else gets a generic message.
ERROR_MESSAGES = {
    402: 'One or both locations could not be found. Try adding the city and state or country.',
    611: 'Please enter both a starting location and a destination.',
}


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
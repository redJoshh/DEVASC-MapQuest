// Unit conversion and formatting.
//
// The backend always sends raw imperial values (miles, gallons), which is what
// MapQuest returns by default. Converting here, in the browser, is what lets
// the Miles/Kilometers switch update instantly without a new API request.
//
// These are the same conversion factors the original lab script used, so the
// numbers match the lab's output (Test Case 2).

export const KM_PER_MILE = 1.61;
export const L_PER_GALLON = 3.78;

// metric = true  -> "66.02 km"
// metric = false -> "41.01 mi"
export const formatDistance = (miles, metric) =>
  metric ? `${(miles * KM_PER_MILE).toFixed(2)} km` : `${miles.toFixed(2)} mi`;

// metric = true  -> "3.78 L"
// metric = false -> "1.00 gal"
export const formatFuel = (gallons, metric) =>
  metric
    ? `${(gallons * L_PER_GALLON).toFixed(2)} L`
    : `${gallons.toFixed(2)} gal`;

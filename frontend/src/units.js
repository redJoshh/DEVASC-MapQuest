// Same conversion factors the lab used. MapQuest returns miles and gallons.
export const KM_PER_MILE = 1.61;
export const L_PER_GALLON = 3.78;

export const formatDistance = (miles, metric) =>
  metric ? `${(miles * KM_PER_MILE).toFixed(2)} km` : `${miles.toFixed(2)} mi`;

export const formatFuel = (gallons, metric) =>
  metric
    ? `${(gallons * L_PER_GALLON).toFixed(2)} L`
    : `${gallons.toFixed(2)} gal`;

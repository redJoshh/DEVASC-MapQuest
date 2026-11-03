// Same conversion factor the lab used. MapQuest returns miles.
export const KM_PER_MILE = 1.61;

export const formatDistance = (miles, metric) =>
  metric ? `${(miles * KM_PER_MILE).toFixed(2)} km` : `${miles.toFixed(2)} mi`;

// Route types the backend accepts (MapQuest's routeType values) and their labels.
export const ROUTE_TYPES = [
  { value: "fastest", label: "Fastest" },
  { value: "shortest", label: "Shortest" },
  { value: "pedestrian", label: "Walking" },
  { value: "bicycle", label: "Bicycle" },
];

export const DEFAULT_ROUTE_TYPE = "fastest";

export const routeTypeLabel = (type) =>
  ROUTE_TYPES.find((t) => t.value === type)?.label ?? type;

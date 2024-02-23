import config from "./charts-config.json";

export function getConfig(id) {
  const chartConfig = config.find((item) => item.id === id);
  if (!chartConfig) {
    throw new Error(`No config found for chart id ${id}`);
  }
  return chartConfig;
}

export function getFilterLabel(filterId) {
  const filters = {
    "country_code": "Pays",
    // "theme": "Thème",
    // "chart_id": "Graphique"
  };

  return filters[filterId] || filterId;
}
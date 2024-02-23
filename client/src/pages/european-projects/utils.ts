import config from "./charts-config.json";

export function getConfig(id) {
  const chartConfig = config.find((item) => item.id === id);
  if (!chartConfig) {
    throw new Error(`No config found for chart id ${id}`);
  }
  return chartConfig;
}
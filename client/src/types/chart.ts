import type Highcharts from "highcharts";

// Type pour les options Highcharts qui peuvent être null
export type ChartOptions = Highcharts.Options | null;

// Fonction utilitaire pour s'assurer que les options sont compatibles
export function ensureChartOptions(options: Highcharts.Options | null): ChartOptions {
  return options;
}

// Type assertion pour forcer la compatibilité
export function asChartOptions(options: Highcharts.Options | null): Highcharts.Options {
  if (options === null || options === undefined) {
    throw new Error("Chart options cannot be null or undefined");
  }
  return options as Highcharts.Options;
}

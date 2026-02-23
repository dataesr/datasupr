/**
 * Création des bandes de seuil (plotBands/plotLines) pour Highcharts.
 *
 * Les seuils (ale_val, vig_min, vig_max) servent exclusivement à la
 * visualisation sur les graphiques : zones colorées de vigilance et d'alerte.
 * Ils ne doivent PAS être utilisés pour calculer un statut (utiliser `getMetricStatus` pour ça).
 */

import Highcharts from "highcharts";
import { getCssColor } from "../../../../utils/colors";
import type { ThresholdConfig } from "./threshold-legend";

export interface ThresholdPlotConfig {
  plotBands: Highcharts.YAxisPlotBandsOptions[];
  plotLines: Highcharts.YAxisPlotLinesOptions[];
}

const EMPTY_CONFIG: ThresholdPlotConfig = { plotBands: [], plotLines: [] };

export function createThresholdPlotBands(
  threshold: ThresholdConfig | null
): ThresholdPlotConfig {
  if (!threshold) return EMPTY_CONFIG;

  const plotBands: Highcharts.YAxisPlotBandsOptions[] = [];
  const plotLines: Highcharts.YAxisPlotLinesOptions[] = [];

  // Zone de vigilance
  if (threshold.vig_min != null && threshold.vig_max != null) {
    const isAbove = threshold.ale_sens === "sup";
    plotBands.push({
      from: threshold.vig_min,
      to: threshold.vig_max,
      color: getCssColor("threshold-vigilance-bg"),
      zIndex: 0,
    });
    // Ligne à la frontière normal ↔ vigilance
    plotLines.push({
      value: isAbove ? threshold.vig_min : threshold.vig_max,
      color: getCssColor("threshold-vigilance-line"),
      width: 2,
      zIndex: 10,
    });
  }
  console.log(threshold.ale_val, threshold.ale_sens, threshold.ale_lib);
  // Zone d'alerte
  if (threshold.ale_val != null && threshold.ale_sens) {
    const isAbove = threshold.ale_sens === "sup";
    plotBands.push({
      from: isAbove ? threshold.ale_val : -Infinity,
      to: isAbove ? Infinity : threshold.ale_val,
      color: getCssColor("threshold-alert-bg"),
      zIndex: 0,
    });
    plotLines.push({
      value: threshold.ale_val,
      color: getCssColor("threshold-alert-line"),
      width: 2,
      zIndex: 10,
    });
  }

  return { plotBands, plotLines };
}

/**
 * Création des bandes de seuil (plotBands/plotLines) pour Highcharts.
 *
 * Les seuils (ale_val, vig_min, vig_max) servent exclusivement à la
 * visualisation sur les graphiques : zones colorées de vigilance et d'alerte.
 * Ils ne doivent PAS être utilisés pour calculer un statut (utiliser `getMetricStatus` pour ça).
 */

import Highcharts from "highcharts";
import { THRESHOLD_COLORS } from "../../constants/colors";
import type { ThresholdConfig } from "../../config";

export interface ThresholdPlotConfig {
  plotBands: Highcharts.YAxisPlotBandsOptions[];
  plotLines: Highcharts.YAxisPlotLinesOptions[];
}

const EMPTY_CONFIG: ThresholdPlotConfig = { plotBands: [], plotLines: [] };

/**
 * Génère les plotBands et plotLines Highcharts à partir d'une configuration de seuils.
 *
 * @param threshold - Configuration des seuils (depuis `useMetricThreshold`)
 * @param dataMin - Valeur minimale des données du graphique
 * @param dataMax - Valeur maximale des données du graphique
 * @returns Les plotBands (zones colorées) et plotLines (lignes de séparation)
 */
export function createThresholdPlotBands(
  threshold: ThresholdConfig | null,
  dataMin: number,
  dataMax: number
): ThresholdPlotConfig {
  if (!threshold) return EMPTY_CONFIG;

  const plotBands: Highcharts.YAxisPlotBandsOptions[] = [];
  const plotLines: Highcharts.YAxisPlotLinesOptions[] = [];
  const margin = Math.abs(dataMax - dataMin) * 0.3;

  // Zone de vigilance
  if (threshold.vig_min != null && threshold.vig_max != null) {
    plotBands.push({
      from: threshold.vig_min,
      to: threshold.vig_max,
      color: THRESHOLD_COLORS.vigilanceBackground,
      zIndex: 0,
    });
    plotLines.push({
      value: threshold.vig_min,
      color: THRESHOLD_COLORS.vigilanceLine,
      width: 1.5,
      zIndex: 1,
    });
  }

  // Zone d'alerte
  if (threshold.ale_val != null && threshold.ale_sens) {
    const isAbove = threshold.ale_sens === "sup";
    plotBands.push({
      from: isAbove ? threshold.ale_val : dataMin - margin,
      to: isAbove ? dataMax + margin : threshold.ale_val,
      color: THRESHOLD_COLORS.alertBackground,
      zIndex: 0,
    });
    plotLines.push({
      value: threshold.ale_val,
      color: THRESHOLD_COLORS.alertLine,
      width: 2,
      zIndex: 1,
    });
  }

  return { plotBands, plotLines };
}

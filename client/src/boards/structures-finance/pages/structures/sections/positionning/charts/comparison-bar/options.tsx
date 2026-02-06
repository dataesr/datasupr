import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { THRESHOLD_COLORS } from "../../../../../../constants/colors";
import type { ThresholdConfig } from "../../../../../../config";
import { calculateOptimalTickInterval } from "../../../../../../utils/chartUtils";

interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
  suffix?: string;
}

export interface PositioningComparisonBarConfig {
  metric: string;
  metricLabel: string;
  metricConfig: MetricConfig;
  threshold?: ThresholdConfig | null;
  sens?: "augmentation" | "diminution" | null;
}

const ALERT_COLOR = THRESHOLD_COLORS.alertBackground;
const VIGILANCE_COLOR = THRESHOLD_COLORS.vigilanceBackground;
const ALERT_LINE = THRESHOLD_COLORS.alertLine;
const VIGILANCE_LINE = THRESHOLD_COLORS.vigilanceLine;

const createThresholdPlotBands = (
  threshold: ThresholdConfig | null,
  dataMin: number,
  dataMax: number
): {
  plotBands: Highcharts.YAxisPlotBandsOptions[];
  plotLines: Highcharts.YAxisPlotLinesOptions[];
} => {
  if (!threshold) return { plotBands: [], plotLines: [] };

  const plotBands: Highcharts.YAxisPlotBandsOptions[] = [];
  const plotLines: Highcharts.YAxisPlotLinesOptions[] = [];
  const margin = Math.abs(dataMax - dataMin) * 0.3;

  if (threshold.vig_min != null && threshold.vig_max != null) {
    plotBands.push({
      from: threshold.vig_min,
      to: threshold.vig_max,
      color: VIGILANCE_COLOR,
      zIndex: 0,
    });
    plotLines.push({
      value: threshold.vig_min,
      color: VIGILANCE_LINE,
      width: 1.5,
      zIndex: 1,
    });
  }

  if (threshold.ale_val != null && threshold.ale_sens) {
    const isAbove = threshold.ale_sens === "sup";
    plotBands.push({
      from: isAbove ? threshold.ale_val : dataMin - margin,
      to: isAbove ? dataMax + margin : threshold.ale_val,
      color: ALERT_COLOR,
      zIndex: 0,
    });
    plotLines.push({
      value: threshold.ale_val,
      color: ALERT_LINE,
      width: 2,
      zIndex: 1,
    });
  }

  return { plotBands, plotLines };
};

export const createPositioningComparisonBarOptions = (
  config: PositioningComparisonBarConfig,
  data: any[],
  currentStructureId?: string,
  currentStructureName?: string
): Highcharts.Options => {
  const seenIds = new Set<string>();
  const uniqueData = data.filter((item) => {
    const itemId = item.etablissement_id_paysage_actuel;
    if (!itemId || seenIds.has(itemId)) return false;
    seenIds.add(itemId);
    return true;
  });

  const chartData = uniqueData
    .map((item: any) => {
      const itemId = item.etablissement_id_paysage_actuel;
      const isCurrentStructure =
        currentStructureId && itemId === currentStructureId;

      return {
        name:
          item.etablissement_actuel_lib || item.etablissement_lib || "Sans nom",
        value: item[config.metric] || 0,
        isCurrentStructure,
      };
    })
    .sort((a, b) => {
      // Logique métier warning warning
      // Appliquer le sens de tri spécifique si défini,
      // sinon tri décroissant par défaut
      if (config.sens === "augmentation") {
        return a.value - b.value;
      } else if (config.sens === "diminution") {
        return b.value - a.value;
      }
      // Tri par défaut : décroissant
      return b.value - a.value;
    });

  let dataMin = Infinity;
  let dataMax = -Infinity;
  chartData.forEach((item) => {
    const value = item.value;
    if (!isNaN(value)) {
      dataMin = Math.min(dataMin, value);
      dataMax = Math.max(dataMax, value);
    }
  });

  const thresholdConfig = config.threshold
    ? createThresholdPlotBands(config.threshold, dataMin, dataMax)
    : { plotBands: [], plotLines: [] };

  const tickInterval = calculateOptimalTickInterval(
    dataMin,
    dataMax,
    config.metricConfig.format
  );

  const chartHeight = Math.max(500, chartData.length * 25);
  // A voir si on override avec ce que Anne à fait?

  return createChartOptions("bar", {
    chart: {
      height: chartHeight,
    },
    title: {
      text: "",
    },
    accessibility: {
      description: `Graphique en barres comparant ${config.metricLabel} pour ${chartData.length} établissements. ${currentStructureName || "L'établissement sélectionné"} est mis en évidence.`,
    },
    xAxis: {
      categories: chartData.map((d) => d.name),
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: "",
      },
      tickInterval: tickInterval,
      labels: {
        formatter: function () {
          const value = this.value as number;
          if (config.metricConfig.format === "euro") {
            return `${Highcharts.numberFormat(value, 0, ",", " ")} €`;
          }
          if (config.metricConfig.format === "percent") {
            return `${value.toFixed(1)}%`;
          }
          if (config.metricConfig.format === "decimal") {
            return value.toFixed(2);
          }
          return Highcharts.numberFormat(value, 0, ",", " ");
        },
      },
      plotBands:
        thresholdConfig.plotBands.length > 0
          ? thresholdConfig.plotBands
          : undefined,
      plotLines:
        thresholdConfig.plotLines.length > 0
          ? thresholdConfig.plotLines
          : undefined,
    },
    tooltip: {
      useHTML: true,
      borderWidth: 1,
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const point = this as any;
        const value = point.y as number;
        let formatted: string;
        if (config.metricConfig.format === "euro") {
          formatted = `${Highcharts.numberFormat(value, 0, ",", " ")} €`;
        } else if (config.metricConfig.format === "percent") {
          formatted = `${value.toFixed(2)}%`;
        } else if (config.metricConfig.format === "decimal") {
          formatted = value.toFixed(2);
        } else {
          formatted = Highcharts.numberFormat(value, 0, ",", " ");
        }

        return `
          <div class="fr-p-2w">
            <div class="fr-text--bold fr-mb-1v">
              ${point.category}
            </div>
            <div class="fr-mt-1w">
              <strong>${config.metricLabel}:</strong> ${formatted}
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
        },
        borderRadius: 4,
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "bar",
        name: config.metricLabel,
        data: chartData.map((d) => ({
          y: d.value,
          color: d.isCurrentStructure
            ? "var(--background-flat-info)"
            : "var(--text-default-grey)",
        })),
      },
    ],
  });
};

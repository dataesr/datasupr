import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../components/chart-wrapper/default-options";
import {
  CHART_COLORS,
  THRESHOLD_COLORS,
} from "../../../../../constants/colors";
import type { ThresholdConfig } from "../../../../../config";

export interface ComparisonBarConfig {
  metric: string;
  metricLabel: string;
  topN: number;
  format?: (value: number) => string;
  threshold?: ThresholdConfig | null;
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

export const createComparisonBarOptions = (
  config: ComparisonBarConfig,
  data: any[]
): Highcharts.Options => {
  const chartData = data
    .filter((item: any) => {
      const value = item[config.metric];
      return value != null && !isNaN(value);
    })
    .map((item: any) => ({
      name:
        item.etablissement_actuel_lib || item.etablissement_lib || "Sans nom",
      value: item[config.metric],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, config.topN);

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

  return createChartOptions("bar", {
    chart: {
      height: Math.max(400, chartData.length * 25 + 100),
    },
    title: {
      text: "",
    },
    accessibility: {
      description: `Graphique en barres comparant ${config.metricLabel} pour ${chartData.length} établissements`,
    },
    xAxis: {
      categories: chartData.map((d) => d.name),
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        formatter: function () {
          if (config.format) {
            return config.format(this.value as number);
          }
          return String(this.value);
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
      formatter: function () {
        const value = this.y as number;
        const formatted = config.format
          ? config.format(value)
          : value.toLocaleString("fr-FR");
        return `
          <div style="padding:8px">
            <div style="font-weight:600;margin-bottom:4px">${this.category}</div>
            <div>
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
        color: CHART_COLORS.primary,
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
        data: chartData.map((d) => d.value),
      },
    ],
  });
};

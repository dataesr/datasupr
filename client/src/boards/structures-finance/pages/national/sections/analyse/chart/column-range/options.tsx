import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
  suffix?: string;
}

export interface ColumnRangePoint {
  name: string;
  low: number;
  high: number;
  valueFrom: number;
  valueTo: number;
  variation: number;
  variationPct: number;
}

export interface ColumnRangeConfig {
  metric: string;
  metricLabel: string;
  metricConfig: MetricConfig;
  yearFrom: string;
  yearTo: string;
  topN: number;
}

const formatValue = (
  value: number,
  format: "number" | "percent" | "decimal" | "euro"
): string => {
  if (format === "euro") {
    return `${Highcharts.numberFormat(value, 0, ",", " ")} €`;
  }
  if (format === "percent") {
    return `${value.toFixed(2)} %`;
  }
  if (format === "decimal") {
    return value.toFixed(2);
  }
  return Highcharts.numberFormat(value, 0, ",", " ");
};

export const createColumnRangeOptions = (
  config: ColumnRangeConfig,
  points: ColumnRangePoint[]
): Highcharts.Options => {
  const colorUp = getCssColor("background-flat-success");
  const colorDown = getCssColor("background-flat-error");

  const seriesData = points.map((p) => ({
    low: Math.min(p.valueFrom, p.valueTo),
    high: Math.max(p.valueFrom, p.valueTo),
    color: p.variation >= 0 ? colorUp : colorDown,
    custom: p,
  }));

  const allValues = points.flatMap((p) => [p.valueFrom, p.valueTo]);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const padding = (dataMax - dataMin) * 0.05;

  return createChartOptions("columnrange", {
    chart: {
      type: "columnrange",
      inverted: true,
      height: Math.max(400, points.length * 22 + 120),
    },
    title: { text: "" },
    xAxis: {
      categories: points.map((p) => p.name),
      gridLineWidth: 0,
    },
    yAxis: {
      title: { text: "" },
      min: Math.max(0, dataMin - padding),
      max: dataMax + padding,
      labels: {
        formatter: function () {
          return formatValue(this.value as number, config.metricConfig.format);
        },
      },
    },
    tooltip: {
      useHTML: true,
      borderWidth: 1,
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const point = this as any;
        const p: ColumnRangePoint = point.point.custom;
        const arrow = p.variation >= 0 ? "▲" : "▼";
        const color = p.variation >= 0 ? colorUp : colorDown;
        const sign = p.variation >= 0 ? "+" : "";

        return `
          <div class="fr-p-2w">
            <div class="fr-text--bold fr-mb-1v">${p.name}</div>
            <div>${config.yearFrom} : <strong>${formatValue(p.valueFrom, config.metricConfig.format)}</strong></div>
            <div>${config.yearTo} : <strong>${formatValue(p.valueTo, config.metricConfig.format)}</strong></div>
            <div style="color:${color};font-weight:bold;margin-top:4px">
              ${arrow} ${sign}${formatValue(p.variation, config.metricConfig.format)}
              (${sign}${p.variationPct.toFixed(1)} %)
            </div>
          </div>`;
      },
    },
    legend: { enabled: false },
    plotOptions: {
      columnrange: {
        dataLabels: { enabled: false },
        borderRadius: 4,
        pointWidth: 12,
      },
    },
    series: [
      {
        type: "columnrange",
        name: config.metricLabel,
        data: seriesData,
      } as Highcharts.SeriesColumnrangeOptions,
    ],
  });
};

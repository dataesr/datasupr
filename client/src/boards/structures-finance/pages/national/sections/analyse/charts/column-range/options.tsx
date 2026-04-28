import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
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
  isHighlighted?: boolean;
  fromLabel?: string;
  toLabel?: string;
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
  const colorHighlight = getCssColor("background-action-high-blue-france");

  // Remove points whose variation rounds to 0.0 % — they render as invisible bars
  const filteredPoints = points.filter(
    (p) => p.variationPct.toFixed(1) !== "0.0" && p.variationPct.toFixed(1) !== "-0.0"
  );

  const seriesData = filteredPoints.map((p) => ({
    low: Math.min(p.valueFrom, p.valueTo),
    high: Math.max(p.valueFrom, p.valueTo),
    color: p.isHighlighted
      ? colorHighlight
      : p.variation >= 0
        ? colorUp
        : colorDown,
    borderColor: p.isHighlighted ? colorHighlight : undefined,
    borderWidth: p.isHighlighted ? 2 : 0,
    custom: p,
  }));

  const allValues = filteredPoints.flatMap((p) => [p.valueFrom, p.valueTo]);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const range = dataMax - dataMin;
  const padding = range === 0 ? Math.max(Math.abs(dataMax) * 0.05, 1) : range * 0.05;

  return createChartOptions("columnrange", {
    chart: {
      type: "columnrange",
      inverted: true,
      height: Math.max(400, filteredPoints.length * 22 + 120),
    },
    title: { text: "" },
    xAxis: {
      categories: filteredPoints.map((p) => p.name),
      gridLineWidth: 0,
    },
    yAxis: {
      title: { text: "" },
      min: dataMin - padding,
      max: dataMax + padding,
      plotLines: [
        {
          value: 0,
          color: getCssColor("border-default-grey"),
          width: 1,
          zIndex: 1,
        },
      ],
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
        const fromLabel = p.fromLabel ?? config.yearFrom;
        const toLabel = p.toLabel ?? config.yearTo;

        return `
          <div class="fr-p-2w">
            <div class="fr-text--bold fr-mb-1v">${p.name}</div>
            <div>${fromLabel} : <strong>${formatValue(p.valueFrom, config.metricConfig.format)}</strong></div>
            <div>${toLabel} : <strong>${formatValue(p.valueTo, config.metricConfig.format)}</strong></div>
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
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "11px",
            fontWeight: "700",
            textOutline: "none",
          },
          formatter: function () {
            const self = this as any;
            const p = (self.point?.custom ?? {}) as ColumnRangePoint;
            if (p.variationPct == null) return null;
            // Don't show label when variation rounds to ±0.0 (low === high causes duplicate labels)
            const rounded = p.variationPct.toFixed(1);
            if (rounded === "0.0" || rounded === "-0.0") return null;
            // Only render at the high endpoint to avoid duplicates
            if (self.y !== self.point?.high) return null;
            const sign = p.variationPct >= 0 ? "+" : "";
            return `${sign}${rounded} %`;
          },
        },
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

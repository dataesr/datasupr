import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { createThresholdPlotBands } from "../../../../../../components/threshold-bands";
import { THRESHOLD_COLORS } from "../../../../../../constants/colors";
import type { ThresholdConfig } from "../../../../../../config";
import { calculateOptimalTickInterval } from "../../../../../../utils/chartUtils";

interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
}

export const createSingleChartOptions = (
  data: any[],
  metricKey: string,
  metricsConfig: Record<string, MetricConfig>,
  threshold: ThresholdConfig | null,
  xAxisField: "exercice" | "anuniv"
): Highcharts.Options => {
  const sortedData = [...data]
    .sort((a, b) => a.exercice - b.exercice)
    .filter((item) => {
      const value = item[metricKey];
      return value != null && value !== 0;
    });

  let dataMin = Infinity;
  let dataMax = -Infinity;
  sortedData.forEach((item) => {
    const value = Number(item[metricKey]);
    if (!isNaN(value)) {
      dataMin = Math.min(dataMin, value);
      dataMax = Math.max(dataMax, value);
    }
  });

  const thresholdConfig = threshold
    ? createThresholdPlotBands(threshold, dataMin, dataMax)
    : { plotBands: [], plotLines: [] };

  const config = metricsConfig[metricKey];
  const isIPCMetric = metricKey.endsWith("_ipc");
  const refIpc =
    sortedData.length > 0 ? sortedData[0]["ref_ipc"] || null : null;

  const tickInterval = calculateOptimalTickInterval(
    dataMin,
    dataMax,
    config.format
  );

  let seriesName = config.label;
  if (isIPCMetric && refIpc) {
    seriesName = `${config.label} (IPC ${refIpc})`;
  }

  return createChartOptions("line", {
    chart: {
      height: 500,
    },
    xAxis: {
      categories: sortedData.map((item) => String(item[xAxisField])),
      title: {
        text: xAxisField === "anuniv" ? "Année universitaire" : "Exercice",
      },
      crosshair: true,
      lineWidth: 1,
    },
    yAxis: {
      title: {
        text: config.label,
      },
      tickInterval: tickInterval,
      labels: {
        formatter: function (this: any) {
          const value = this.value as number;
          if (config.format === "euro") {
            return `€${Highcharts.numberFormat(value, 0, ",", " ")}`;
          }
          if (config.format === "percent") {
            return `${value.toFixed(1)}%`;
          }
          if (config.format === "decimal") {
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
      shared: true,
      useHTML: true,
      borderWidth: 1,
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const year = this.points?.[0]?.key || this.x;
        const yearIndex = sortedData.findIndex(
          (d) => String(d[xAxisField]) === String(year)
        );
        const etablissement =
          yearIndex >= 0 ? sortedData[yearIndex].etablissement_lib || "" : "";
        let tooltip = `<div style="padding:10px"><div style="font-weight:bold;margin-bottom:8px">${etablissement}</div>`;

        this.points?.forEach((point: any) => {
          let valueStr = "";
          if (config.format === "euro") {
            valueStr = `${Highcharts.numberFormat(point.y, 0, ",", " ")} €`;
          } else if (config.format === "percent") {
            valueStr = `${point.y.toFixed(2)}%`;
          } else if (config.format === "decimal") {
            valueStr = point.y.toFixed(2);
          } else {
            valueStr = Highcharts.numberFormat(point.y, 0, ",", " ");
          }

          if (isIPCMetric && yearIndex >= 0) {
            const refIpc = sortedData[yearIndex]["ref_ipc"];
            if (refIpc) {
              valueStr += `<br/><span style="font-size:11px">base ${refIpc}</span>`;
            }
          }

          tooltip += `<div style="margin-top:4px">
            <span style="color:${point.series.color}">●</span> 
            <strong>${point.series.name}:</strong> ${valueStr}
          </div>`;
        });

        if (threshold) {
          const value = this.points?.[0]?.y;
          if (value != null) {
            let zoneInfo = "";
            const isAlert =
              threshold.ale_sens === "sup"
                ? value >= (threshold.ale_val ?? Infinity)
                : value <= (threshold.ale_val ?? -Infinity);
            const isVigilance =
              threshold.vig_min != null &&
              threshold.vig_max != null &&
              value >= threshold.vig_min &&
              value <= threshold.vig_max;

            if (isAlert) {
              zoneInfo = `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #ddd;color:${THRESHOLD_COLORS.alertLine}"><strong>⚠ Zone d'alerte</strong></div>`;
            } else if (isVigilance) {
              zoneInfo = `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #ddd;color:${THRESHOLD_COLORS.vigilanceLine}"><strong>⚠ Zone de vigilance</strong></div>`;
            }
            tooltip += zoneInfo;
          }
        }

        tooltip += `</div>`;
        return tooltip;
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: isIPCMetric ? 5 : 4,
          symbol: isIPCMetric ? "square" : "circle",
        },
        lineWidth: 2,
      },
    },
    series: [
      {
        name: seriesName,
        data: sortedData.map((item) => {
          const value = Number(item[metricKey]);
          return isNaN(value) ? null : value;
        }),
        color: isIPCMetric ? "var(--text-title-blue-france)" : config.color,
        type: "line" as const,
      },
    ] as any,
  });
};

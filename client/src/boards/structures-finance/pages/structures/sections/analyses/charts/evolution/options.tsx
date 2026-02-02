import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { THRESHOLD_COLORS } from "../../../../../../constants/colors";
import type { ThresholdConfig } from "../../../../../../config";

interface EvolutionData {
  exercice: number;
  [key: string]: any;
}

interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
  suffix?: string;
}

const ALERT_COLOR = THRESHOLD_COLORS.alertBackground;
const VIGILANCE_COLOR = THRESHOLD_COLORS.vigilanceBackground;
const ALERT_LINE = THRESHOLD_COLORS.alertLine;
const VIGILANCE_LINE = THRESHOLD_COLORS.vigilanceLine;

export const createThresholdPlotBands = (
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

export const createEvolutionChartOptions = (
  data: EvolutionData[],
  selectedMetrics: string[],
  metricsConfig: Record<string, MetricConfig>,
  isBase100: boolean = false,
  threshold: ThresholdConfig | null = null,
  xAxisField: "exercice" | "anuniv" = "exercice"
): Highcharts.Options => {
  const sortedData = [...data]
    .sort((a, b) => a.exercice - b.exercice)
    .filter((item) =>
      selectedMetrics.some((metric) => {
        const value = item[metric];
        return value != null && value !== 0;
      })
    );

  let dataMin = Infinity;
  let dataMax = -Infinity;
  sortedData.forEach((item) => {
    selectedMetrics.forEach((metric) => {
      const value = Number(item[metric]);
      if (!isNaN(value)) {
        dataMin = Math.min(dataMin, value);
        dataMax = Math.max(dataMax, value);
      }
    });
  });

  const thresholdConfig =
    selectedMetrics.length === 1 && !isBase100 && threshold
      ? createThresholdPlotBands(threshold, dataMin, dataMax)
      : { plotBands: [], plotLines: [] };

  const baseValues: Record<string, number> = {};
  if (isBase100 && sortedData.length > 0) {
    selectedMetrics.forEach((metricKey) => {
      const firstValue = sortedData[0][metricKey];
      if (typeof firstValue === "number" && firstValue !== 0) {
        baseValues[metricKey] = firstValue;
      }
    });
  }

  const refIpc =
    sortedData.length > 0 ? sortedData[0]["ref_ipc"] || null : null;

  const series = selectedMetrics.map((metricKey, index) => {
    const config = metricsConfig[metricKey];
    const isIPCMetric = metricKey.endsWith("_ipc");

    const useSameAxis =
      selectedMetrics.length === 2 &&
      metricsConfig[selectedMetrics[0]].format ===
        metricsConfig[selectedMetrics[1]].format;

    let seriesName = config.label;
    if (isIPCMetric && refIpc) {
      seriesName = `${config.label} (IPC ${refIpc})`;
    }

    return {
      name: seriesName,
      data: sortedData.map((item) => {
        const value = Number(item[metricKey]);
        if (isNaN(value)) return null;

        if (isBase100 && baseValues[metricKey]) {
          return (value / baseValues[metricKey]) * 100;
        }
        return value;
      }),
      color: isIPCMetric ? "var(--text-title-blue-france)" : config.color,
      lineWidth: isIPCMetric ? 2 : 2,
      marker: {
        enabled: true,
        radius: isIPCMetric ? 5 : 4,
        symbol: isIPCMetric ? "square" : "circle",
      },
      yAxis: isBase100
        ? 0
        : useSameAxis
          ? 0
          : selectedMetrics.length > 1 && index === 1
            ? 1
            : 0,
      type: "line" as const,
      visible: true,
    };
  });

  const yAxisConfig =
    selectedMetrics.length > 1 &&
    !isBase100 &&
    metricsConfig[selectedMetrics[0]].format !==
      metricsConfig[selectedMetrics[1]].format
      ? [
          {
            title: {
              text: metricsConfig[selectedMetrics[0]].label,
              style: {
                color: metricsConfig[selectedMetrics[0]].color,
              },
            },
            labels: {
              style: {
                color: metricsConfig[selectedMetrics[0]].color,
              },
              formatter: function (this: any) {
                const value = this.value as number;
                const format = metricsConfig[selectedMetrics[0]].format;
                if (format === "euro") {
                  return `€${Highcharts.numberFormat(value, 0, ",", " ")}`;
                }
                if (format === "percent") {
                  return `${value.toFixed(1)}%`;
                }
                if (format === "decimal") {
                  return value.toFixed(2);
                }
                return Highcharts.numberFormat(value, 0, ",", " ");
              },
            },
          },
          {
            title: {
              text: metricsConfig[selectedMetrics[1]].label,
              style: {
                color: metricsConfig[selectedMetrics[1]].color,
              },
            },
            opposite: true,
            labels: {
              style: {
                color: metricsConfig[selectedMetrics[1]].color,
              },
              formatter: function (this: any) {
                const value = this.value as number;
                const format = metricsConfig[selectedMetrics[1]].format;
                if (format === "euro") {
                  return `€${Highcharts.numberFormat(value, 0, ",", " ")}`;
                }
                if (format === "percent") {
                  return `${value.toFixed(1)}%`;
                }
                if (format === "decimal") {
                  return value.toFixed(2);
                }
                return Highcharts.numberFormat(value, 0, ",", " ");
              },
            },
            gridLineColor: "transparent",
          },
        ]
      : {
          title: {
            text: isBase100
              ? "Index (base 100 = première année)"
              : selectedMetrics.length > 0
                ? selectedMetrics.length === 2 &&
                  metricsConfig[selectedMetrics[0]].format ===
                    metricsConfig[selectedMetrics[1]].format
                  ? `${metricsConfig[selectedMetrics[0]].label} / ${metricsConfig[selectedMetrics[1]].label}`
                  : metricsConfig[selectedMetrics[0]].label
                : "Valeur",
          },
          labels: {
            formatter: function (this: any) {
              const value = this.value as number;
              if (isBase100) {
                return value.toFixed(1);
              }
              const format =
                selectedMetrics.length > 0
                  ? metricsConfig[selectedMetrics[0]].format
                  : "number";
              if (format === "euro") {
                return `€${Highcharts.numberFormat(value, 0, ",", " ")}`;
              }
              if (format === "percent") {
                return `${value.toFixed(1)}%`;
              }
              if (format === "decimal") {
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
        };

  return createChartOptions("line", {
    chart: {
      height: 500,
    },
    xAxis: {
      categories: sortedData.map((item) => String(item[xAxisField])),
      title: {
        text: xAxisField === "anuniv" ? "Année universitaire" : "Année",
      },
      crosshair: true,
      lineWidth: 1,
    },
    yAxis: yAxisConfig as any,
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
          const metricKey = selectedMetrics.find(
            (key) => metricsConfig[key].label === point.series.name
          );
          const config = metricKey ? metricsConfig[metricKey] : null;

          let valueStr = "";
          if (isBase100) {
            const originalValue =
              yearIndex >= 0 ? sortedData[yearIndex][metricKey!] : null;
            valueStr = `${point.y.toFixed(1)} (base 100)`;

            if (originalValue !== null && config) {
              let originalStr = "";
              if (config.format === "euro") {
                originalStr = `${Highcharts.numberFormat(
                  originalValue,
                  0,
                  ",",
                  " "
                )} €`;
              } else if (config.format === "percent") {
                originalStr = `${originalValue.toFixed(2)}%`;
              } else if (config.format === "decimal") {
                originalStr = originalValue.toFixed(2);
              } else {
                originalStr = Highcharts.numberFormat(
                  originalValue,
                  0,
                  ",",
                  " "
                );
              }
              valueStr += `<br/><span style="font-size:11px">${originalStr}</span>`;
            }
          } else {
            if (config?.format === "euro") {
              valueStr = `${Highcharts.numberFormat(point.y, 0, ",", " ")} €`;
            } else if (config?.format === "percent") {
              valueStr = `${point.y.toFixed(2)}%`;
            } else if (config?.format === "decimal") {
              valueStr = point.y.toFixed(2);
            } else {
              valueStr = Highcharts.numberFormat(point.y, 0, ",", " ");
            }

            if (metricKey && metricKey.endsWith("_ipc") && yearIndex >= 0) {
              const refIpc = sortedData[yearIndex]["ref_ipc"];
              if (refIpc) {
                valueStr += `<br/><span style="font-size:11px">base ${refIpc}</span>`;
              }
            }
          }

          tooltip += `<div style="margin-top:4px">
            <span style="color:${point.series.color}">●</span> 
            <strong>${point.series.name}:</strong> ${valueStr}
          </div>`;
        });

        if (threshold && selectedMetrics.length === 1 && !isBase100) {
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
              zoneInfo = `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #ddd;color:${ALERT_LINE}"><strong>⚠ Zone d'alerte</strong></div>`;
            } else if (isVigilance) {
              zoneInfo = `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #ddd;color:${VIGILANCE_LINE}"><strong>⚠ Zone de vigilance</strong></div>`;
            }
            tooltip += zoneInfo;
          }
        }

        tooltip += `</div>`;
        return tooltip;
      },
    },
    legend: {
      enabled: selectedMetrics.length > 0,
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "var(--text-default-grey)",
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4,
        },
        lineWidth: 2,
      },
    },
    series: series as any,
  });
};

export const createStackedEvolutionChartOptions = (
  data: EvolutionData[],
  selectedMetrics: string[],
  metricsConfig: Record<string, MetricConfig>,
  showPercentage: boolean = false,
  xAxisField: "exercice" | "anuniv" = "exercice"
): Highcharts.Options => {
  const sortedData = [...data]
    .sort((a, b) => a.exercice - b.exercice)
    .filter((item) =>
      selectedMetrics.some((metric) => {
        const value = item[metric];
        return value != null && value !== 0;
      })
    );

  const series = [...selectedMetrics]
    .reverse()
    .map((metricKey, index) => {
      const config = metricsConfig[metricKey];
      const hasData = sortedData.some((item) => {
        const value = item[metricKey];
        return value != null && value !== 0;
      });

      if (!hasData) return null;

      return {
        name: config.label,
        data: sortedData.map((item) => {
          const value = item[metricKey];
          if (showPercentage) {
            const total = selectedMetrics.reduce((sum, m) => {
              const v = item[m];
              return sum + (typeof v === "number" ? v : 0);
            }, 0);
            return total > 0 ? (value / total) * 100 : 0;
          }
          return typeof value === "number" ? value : 0;
        }),
        color: config.color,
        type: "column" as const,
        // trick pour inverser l'ordre des séries dans la légende (demande de yann)
        legendIndex: selectedMetrics.length - 1 - index,
      };
    })
    .filter(Boolean);

  return createChartOptions("column", {
    chart: {
      height: 500,
      type: "column",
    },
    xAxis: {
      categories: sortedData.map((item) => String(item[xAxisField])),
      title: {
        text: xAxisField === "anuniv" ? "Année universitaire" : "Année",
      },
      crosshair: true,
      lineWidth: 1,
    },
    yAxis: {
      title: {
        text: showPercentage ? "Pourcentage" : "Effectifs",
      },
      labels: {
        formatter: function (this: any) {
          const value = this.value as number;
          if (showPercentage) {
            return Highcharts.numberFormat(value, 0, ",", " ") + "%";
          }
          return Highcharts.numberFormat(value, 0, ",", " ");
        },
      },
      max: showPercentage ? 100 : undefined,
      stackLabels: {
        enabled: !showPercentage,
        style: {
          fontWeight: "bold",
          color: "var(--text-default-grey)",
        },
        formatter: function (this: any) {
          return Highcharts.numberFormat(this.total, 0, ",", " ");
        },
      },
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
        let total = 0;

        this.points?.forEach((point: any) => {
          total += point.y || 0;
          if (showPercentage) {
            const valueStr = Highcharts.numberFormat(point.y, 1, ",", " ");
            tooltip += `<div style="margin-top:4px">
            <span style="color:${point.series.color}">●</span> 
            <strong>${point.series.name}:</strong> ${valueStr}%
          </div>`;
          } else {
            const valueStr = Highcharts.numberFormat(point.y, 0, ",", " ");
            tooltip += `<div style="margin-top:4px">
            <span style="color:${point.series.color}">●</span> 
            <strong>${point.series.name}:</strong> ${valueStr}
          </div>`;
          }
        });

        if (!showPercentage) {
          tooltip += `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #ddd">
          <strong>Total:</strong> ${Highcharts.numberFormat(total, 0, ",", " ")}
        </div>`;
        }
        tooltip += `</div>`;
        return tooltip;
      },
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "var(--text-default-grey)",
      },
    },
    plotOptions: {
      column: {
        stacking: "normal",
        borderRadius: 0,
        borderWidth: 0,
      },
    },
    series: series as any,
  });
};

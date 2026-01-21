import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../components/chart-wrapper/default-options";

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

export const createEvolutionChartOptions = (
  data: EvolutionData[],
  selectedMetrics: string[],
  metricsConfig: Record<string, MetricConfig>,
  isBase100: boolean = false
): Highcharts.Options => {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);

  const baseValues: Record<string, number> = {};
  if (isBase100 && sortedData.length > 0) {
    selectedMetrics.forEach((metricKey) => {
      const firstValue = sortedData[0][metricKey];
      if (typeof firstValue === "number" && firstValue !== 0) {
        baseValues[metricKey] = firstValue;
      }
    });
  }

  const series = selectedMetrics.map((metricKey, index) => {
    const config = metricsConfig[metricKey];
    return {
      name: config.label,
      data: sortedData.map((item) => {
        const value = item[metricKey];
        if (typeof value !== "number") return null;

        if (isBase100 && baseValues[metricKey]) {
          return (value / baseValues[metricKey]) * 100;
        }
        return value;
      }),
      color: config.color,
      yAxis: isBase100 ? 0 : selectedMetrics.length > 1 && index === 1 ? 1 : 0,
      type: "line" as const,
    };
  });

  const yAxisConfig =
    selectedMetrics.length > 1 && !isBase100
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
                ? metricsConfig[selectedMetrics[0]].label
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
        };

  return createChartOptions("line", {
    chart: {
      height: 500,
    },
    xAxis: {
      categories: sortedData.map((item) => String(item.exercice)),
      title: {
        text: "Année",
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
        const yearIndex = sortedData.findIndex(
          (d) => String(d.exercice) === String(this.x)
        );
        let tooltip = `<div style="padding:10px"><div style="font-weight:bold;margin-bottom:8px">${this.x}</div>`;

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
          }

          tooltip += `<div style="margin-top:4px">
            <span style="color:${point.series.color}">●</span> 
            <strong>${point.series.name}:</strong> ${valueStr}
          </div>`;
        });

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

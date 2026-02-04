import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { calculateOptimalTickInterval } from "../../../../../../utils/chartUtils";

interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
}

export const createDualChartOptions = (
  data: any[],
  metric1Key: string,
  metric2Key: string,
  metricsConfig: Record<string, MetricConfig>,
  xAxisField: "exercice" | "anuniv"
): Highcharts.Options => {
  const sortedData = [...data]
    .sort((a, b) => a.exercice - b.exercice)
    .filter((item) => {
      const value1 = item[metric1Key];
      const value2 = item[metric2Key];
      return (
        (value1 != null && value1 !== 0) || (value2 != null && value2 !== 0)
      );
    });

  const config1 = metricsConfig[metric1Key];
  const config2 = metricsConfig[metric2Key];
  const useSameAxis = config1.format === config2.format;

  const refIpc =
    sortedData.length > 0 ? sortedData[0]["ref_ipc"] || null : null;

  let data1Min = Infinity,
    data1Max = -Infinity;
  let data2Min = Infinity,
    data2Max = -Infinity;
  sortedData.forEach((item) => {
    const val1 = Number(item[metric1Key]);
    const val2 = Number(item[metric2Key]);
    if (!isNaN(val1)) {
      data1Min = Math.min(data1Min, val1);
      data1Max = Math.max(data1Max, val1);
    }
    if (!isNaN(val2)) {
      data2Min = Math.min(data2Min, val2);
      data2Max = Math.max(data2Max, val2);
    }
  });

  const tickInterval1 = calculateOptimalTickInterval(
    data1Min,
    data1Max,
    config1.format
  );
  const tickInterval2 = calculateOptimalTickInterval(
    data2Min,
    data2Max,
    config2.format
  );

  const series = [metric1Key, metric2Key].map((metricKey, index) => {
    const config = metricsConfig[metricKey];
    const isIPCMetric = metricKey.endsWith("_ipc");

    let seriesName = config.label;
    if (isIPCMetric && refIpc) {
      seriesName = `${config.label} (IPC ${refIpc})`;
    }

    return {
      name: seriesName,
      data: sortedData.map((item) => {
        const value = Number(item[metricKey]);
        return isNaN(value) ? null : value;
      }),
      color: isIPCMetric ? "var(--text-title-blue-france)" : config.color,
      lineWidth: isIPCMetric ? 2 : 2,
      marker: {
        enabled: true,
        radius: isIPCMetric ? 5 : 4,
        symbol: isIPCMetric ? "square" : "circle",
      },
      yAxis: useSameAxis ? 0 : index,
      type: "line" as const,
    };
  });

  const yAxisConfig = useSameAxis
    ? {
        title: {
          text: `${config1.label} / ${config2.label}`,
        },
        tickInterval: tickInterval1,
        labels: {
          formatter: function (this: any) {
            const value = this.value as number;
            if (config1.format === "euro") {
              return `€${Highcharts.numberFormat(value, 0, ",", " ")}`;
            }
            if (config1.format === "percent") {
              return `${value.toFixed(1)}%`;
            }
            if (config1.format === "decimal") {
              return value.toFixed(2);
            }
            return Highcharts.numberFormat(value, 0, ",", " ");
          },
        },
      }
    : [
        {
          title: {
            text: config1.label,
            style: { color: config1.color },
          },
          tickInterval: tickInterval1,
          labels: {
            style: { color: config1.color },
            formatter: function (this: any) {
              const value = this.value as number;
              if (config1.format === "euro") {
                return `€${Highcharts.numberFormat(value, 0, ",", " ")}`;
              }
              if (config1.format === "percent") {
                return `${value.toFixed(1)}%`;
              }
              if (config1.format === "decimal") {
                return value.toFixed(2);
              }
              return Highcharts.numberFormat(value, 0, ",", " ");
            },
          },
        },
        {
          title: {
            text: config2.label,
            style: { color: config2.color },
          },
          opposite: true,
          tickInterval: tickInterval2,
          labels: {
            style: { color: config2.color },
            formatter: function (this: any) {
              const value = this.value as number;
              if (config2.format === "euro") {
                return `€${Highcharts.numberFormat(value, 0, ",", " ")}`;
              }
              if (config2.format === "percent") {
                return `${value.toFixed(1)}%`;
              }
              if (config2.format === "decimal") {
                return value.toFixed(2);
              }
              return Highcharts.numberFormat(value, 0, ",", " ");
            },
          },
          gridLineColor: "transparent",
        },
      ];

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
          const metricKey =
            point.series.userOptions.yAxis === 0 ? metric1Key : metric2Key;
          const config = metricsConfig[metricKey];

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

          if (metricKey.endsWith("_ipc") && yearIndex >= 0) {
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

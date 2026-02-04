import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
}

export const createStackedChartOptions = (
  data: any[],
  selectedMetrics: string[],
  metricsConfig: Record<string, MetricConfig>,
  showPercentage: boolean,
  xAxisField: "exercice" | "anuniv"
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

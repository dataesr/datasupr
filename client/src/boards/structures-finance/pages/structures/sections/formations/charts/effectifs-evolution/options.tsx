import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";

interface EvolutionData {
  exercice: number;
  [key: string]: any;
}

interface CategoryConfig {
  label: string;
  color: string;
}

export const createStackedEvolutionChartOptions = (
  data: EvolutionData[],
  metrics: string[],
  categories: Record<string, CategoryConfig>
): Highcharts.Options => {
  const sortedData = [...data]
    .sort((a, b) => a.exercice - b.exercice)
    .filter((item) =>
      metrics.some((metric) => {
        const value = item[metric];
        return value != null && value !== 0;
      })
    );

  const series = metrics
    .map((metricKey) => {
      const config = categories[metricKey];
      if (!config) return null;

      const hasData = sortedData.some((item) => {
        const value = item[metricKey];
        return value != null && value !== 0;
      });

      if (!hasData) return null;

      return {
        name: config.label,
        data: sortedData.map((item) => {
          const value = item[metricKey];
          return typeof value === "number" ? value : 0;
        }),
        color: config.color,
        type: "column" as const,
      };
    })
    .filter(Boolean);

  return createChartOptions("column", {
    chart: {
      height: 450,
      type: "column",
    },
    xAxis: {
      categories: sortedData.map((item) => String(item.exercice)),
      title: {
        text: "Année",
      },
      crosshair: true,
      lineWidth: 1,
    },
    yAxis: {
      title: {
        text: "Effectifs",
      },
      labels: {
        formatter: function (this: any) {
          const value = this.value as number;
          return Highcharts.numberFormat(value, 0, ",", " ");
        },
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
          color: "var(--text-default-grey)",
          fontSize: "11px",
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
        let tooltip = `<div style="padding:10px"><div style="font-weight:bold;margin-bottom:8px">${year}</div>`;
        let total = 0;

        this.points?.forEach((point: any) => {
          total += point.y || 0;
          const valueStr = Highcharts.numberFormat(point.y, 0, ",", " ");
          const percentage =
            total > 0
              ? (
                  (point.y /
                    (this.points?.reduce(
                      (acc: number, p: any) => acc + (p.y || 0),
                      0
                    ) || 1)) *
                  100
                ).toFixed(1)
              : "0";
          tooltip += `<div style="margin-top:4px">
            <span style="color:${point.series.color}">●</span> 
            <strong>${point.series.name}:</strong> ${valueStr} <span style="color:#666">(${percentage}%)</span>
          </div>`;
        });

        const grandTotal =
          this.points?.reduce((acc: number, p: any) => acc + (p.y || 0), 0) ||
          0;
        tooltip += `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #ddd">
          <strong>Total:</strong> ${Highcharts.numberFormat(grandTotal, 0, ",", " ")}
        </div>`;
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
        borderRadius: 2,
        borderWidth: 0,
      },
    },
    series: series as any,
  });
};

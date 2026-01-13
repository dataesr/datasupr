import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";
import { CreateChartOptions } from "../../../../chart-options";

export interface ComparisonBarConfig {
  metric: string;
  metricLabel: string;
  topN: number;
  format?: (value: number) => string;
}

export const createComparisonBarOptions = (
  config: ComparisonBarConfig,
  data: any[]
): Highcharts.Options => {
  const chartData = data
    .filter((item: any) => {
      const value = item[config.metric];
      return value != null && !isNaN(value) && value > 0;
    })
    .map((item: any) => ({
      name: item.etablissement_actuel_lib || "Sans nom",
      value: item[config.metric],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, config.topN);

  return CreateChartOptions("bar", {
    chart: {
      height: Math.max(400, chartData.length * 25 + 100),
    },
    title: {
      text: `${config.metricLabel} par établissement`,
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "600",
      },
    },
    accessibility: {
      enabled: true,
      description: `Graphique en barres comparant ${config.metricLabel} pour ${chartData.length} établissements`,
      keyboardNavigation: {
        enabled: true,
      },
    },
    xAxis: {
      categories: chartData.map((d) => d.name),
      title: {
        text: null,
      },
      gridLineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: config.metricLabel,
        align: "high",
        style: {
          fontSize: "13px",
          fontWeight: "500",
        },
      },
      labels: {
        overflow: "justify",
        formatter: function () {
          if (config.format) {
            return config.format(this.value as number);
          }
          return String(this.value);
        },
      },
    },
    tooltip: {
      useHTML: true,
      borderWidth: 1,
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const value = this.y as number;
        const formatted = config.format
          ? config.format(value)
          : value.toLocaleString("fr-FR");
        return `
          <div style="padding:10px">
            <div style="margin-top:8px">
              <strong>${config.metricLabel}:</strong> <span style="font-size:15px;font-weight:600">${formatted}</span>
            </div>
          </div>
        `;
      },
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
        },
        color: CHART_COLORS.primary,
        borderRadius: 4,
      },
      series: {
        animation: {
          duration: 800,
        },
      },
    },
    legend: {
      enabled: true,
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      title: {
        text: "Régions",
        style: {
          color: "var(--text-default-grey)",
        },
      },
      itemStyle: {
        color: "var(--text-default-grey)",
      },
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

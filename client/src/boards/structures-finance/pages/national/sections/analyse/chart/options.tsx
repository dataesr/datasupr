import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../components/chart-wrapper/default-options";
import { CHART_COLORS } from "../../../../../constants/colors";

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
      name:
        item.etablissement_actuel_lib || item.etablissement_lib || "Sans nom",
      value: item[config.metric],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, config.topN);

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
      min: 0,
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

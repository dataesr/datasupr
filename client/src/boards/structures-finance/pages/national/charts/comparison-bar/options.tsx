import Highcharts from "highcharts";
import { CHART_COLORS } from "../../../../constants/colors";

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

  return {
    chart: {
      type: "bar",
      height: Math.max(400, chartData.length * 25 + 100),
      backgroundColor: "transparent",
    },
    title: {
      text: `${config.metricLabel} par établissement`,
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "600",
        color: "var(--text-title-grey)",
      },
    },
    subtitle: {
      text: `Top ${chartData.length} établissements`,
      align: "left",
      style: {
        fontSize: "14px",
        color: "var(--text-mention-grey)",
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
      labels: {
        style: {
          fontSize: "11px",
          color: "var(--text-default-grey)",
        },
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
          color: "var(--text-default-grey)",
        },
      },
      labels: {
        overflow: "justify",
        style: {
          color: "var(--text-default-grey)",
        },
        formatter: function () {
          if (config.format) {
            return config.format(this.value as number);
          }
          return String(this.value);
        },
      },
      gridLineColor: "var(--border-default-grey)",
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "var(--background-default-grey)",
      borderWidth: 1,
      borderColor: "var(--border-default-grey)",
      borderRadius: 8,
      shadow: false,
      formatter: function () {
        const value = this.y as number;
        const formatted = config.format
          ? config.format(value)
          : value.toLocaleString("fr-FR");
        return `
          <div style="padding:10px">
            <div style="font-weight:bold;margin-bottom:8px;font-size:14px">${this.x}</div>
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
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "bar",
        name: config.metricLabel,
        data: chartData.map((d) => d.value),
      },
    ],
  };
};

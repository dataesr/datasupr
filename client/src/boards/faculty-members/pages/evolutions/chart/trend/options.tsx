import { CreateChartOptions } from "../../../../components/creat-chart-options";

interface TrendsOptionsParams {
  years: string[];
  chartData: Array<{
    year: string;
    total: number;
    male: number;
    female: number;
  }>;
  contextName?: string;
  contextType?: "discipline" | "région" | "établissement";
}

export function createTrendsOptions({ years, chartData }: TrendsOptionsParams) {
  const maleData = chartData.map((item) => item.male);
  const femaleData = chartData.map((item) => item.female);
  const totalData = chartData.map((item) => item.total);

  return CreateChartOptions("column", {
    chart: {
      height: 500,
      type: "column",
      marginLeft: 60,
      marginRight: 30,
      marginBottom: 120,
      spacing: [20, 20, 20, 20],
    },
    exporting: { enabled: false },
    title: {
      text: "",
    },
    xAxis: {
      categories: years,
      title: {
        text: "Année académique",
        style: {
          fontSize: "12px",
          color: "#666666",
        },
      },
      labels: {
        style: { fontSize: "11px" },
        rotation: -45,
      },
      lineColor: "#E5E5E5",
      tickColor: "#E5E5E5",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'enseignants",
        style: {
          fontSize: "12px",
          color: "#666666",
        },
      },
      labels: {
        formatter: function () {
          const value = Number(this.value) || 0;
          if (value >= 1000) {
            return `${Math.round(value / 1000)}k`;
          }
          return value.toLocaleString();
        },
        style: { fontSize: "11px" },
      },
      stackLabels: {
        enabled: true,
        formatter: function () {
          const total = this.total || 0;
          if (total >= 10000) {
            return `${Math.round(total / 1000)}k`;
          }
          return total.toLocaleString();
        },
        style: {
          fontWeight: "bold",
          color: "#161616",
          textOutline: "none",
          fontSize: "11px",
        },
      },
      gridLineColor: "#F0F0F0",
      gridLineDashStyle: "Dot",
    },
    tooltip: {
      shared: false,
      formatter: function () {
        const y = this.y || 0;
        const pointIndex = this.point?.index || 0;
        const total = totalData[pointIndex] || 1;
        const percent = ((y / total) * 100).toFixed(1);

        return `<b>Année ${this.x}</b><br/>
         <span style="color:${this.color}">●</span> ${
          this.series.name
        }: <b>${y.toLocaleString()}</b><br/>
         <span style="color:#666666">Part: ${percent}% du total</span><br/>
         <span style="color:#000091">Total: ${total.toLocaleString()}</span>`;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#CCCCCC",
      borderRadius: 8,
      shadow: true,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
        borderWidth: 0,
        pointPadding: 0.15,
        groupPadding: 0.1,
        borderRadius: 2,
      },
      series: {
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
        states: {
          hover: {
            brightness: 0.1,
          },
        },
      },
    },
    series: [
      {
        name: "Hommes",
        data: maleData,
        color: "var(--men-color, #efcb3a)",
        type: "column",
      },
      {
        name: "Femmes",
        data: femaleData,
        color: "var(--women-color, #e18b76)",
        type: "column",
      },
    ],
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        fontSize: "12px",
        fontWeight: "normal",
      },
      itemHoverStyle: {
        color: "#000091",
      },
      symbolRadius: 6,
      symbolHeight: 12,
      symbolWidth: 12,
    },
    credits: { enabled: false },
  });
}

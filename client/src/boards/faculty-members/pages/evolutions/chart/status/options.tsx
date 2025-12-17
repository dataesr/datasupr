import { CreateChartOptions } from "../../../../components/creat-chart-options";

interface StatusEvolutionOptionsParams {
  years: string[];
  statusData: {
    enseignant_chercheur: number[];
    titulaire_non_chercheur: number[];
    non_titulaire: number[];
  };
  contextName?: string;
  contextType?: "discipline" | "région" | "établissement";
}

export function createStatusEvolutionOptions({
  years,
  statusData,
}: StatusEvolutionOptionsParams) {
  return CreateChartOptions("area", {
    chart: {
      height: 500,
      type: "area",
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
          const value = this.value || 0;
          if (typeof value === "number" && value >= 1000) {
            return `${Math.round(value / 1000)}k`;
          }
          return typeof value === "number"
            ? value.toLocaleString()
            : String(value);
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
        const pointIndex = this.index || 0;

        const total =
          (statusData.enseignant_chercheur[pointIndex] || 0) +
          (statusData.titulaire_non_chercheur[pointIndex] || 0) +
          (statusData.non_titulaire[pointIndex] || 0);

        const percent = total > 0 ? ((y / total) * 100).toFixed(1) : "0";

        return `<b>Année ${this.x}</b><br/>
         <span style="color:${this.color}">●</span> ${
          this.series.name
        }: <b>${y.toLocaleString()}</b><br/>
         <span style="color:#666666">Part: ${percent}&nbsp;% du total</span><br/>
         <span style="color:#000091">Total: ${total.toLocaleString()}</span>`;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#CCCCCC",
      borderRadius: 8,
      shadow: true,
    },
    plotOptions: {
      area: {
        stacking: "normal",
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 3,
          states: {
            hover: {
              enabled: true,
              radius: 5,
            },
          },
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3,
            brightness: 0.1,
          },
        },
        fillOpacity: 0.8,
        dataLabels: {
          enabled: false,
        },
      },
      series: {
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    },
    series: [
      {
        name: "Non-permanents",
        data: statusData.non_titulaire,
        color: "#EA526F",
        type: "area",
      },
      {
        name: "Titulaires (non EC)",
        data: statusData.titulaire_non_chercheur,
        color: "#4B9DFF",
        type: "area",
      },
      {
        name: "Enseignants-chercheurs",
        data: statusData.enseignant_chercheur,
        color: "#000091",
        type: "area",
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

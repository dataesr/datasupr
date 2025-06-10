import { CreateChartOptions } from "../../../../components/creat-chart-options";

interface AgeEvolutionOptionsParams {
  years: string[];
  ageData: Record<string, number[]>;
  contextName?: string;
  contextType?: "discipline" | "région" | "établissement";
}

export function createAgeEvolutionOptions({
  years,
  ageData,
  contextName,
  contextType = "discipline",
}: AgeEvolutionOptionsParams) {
  const ageColors = {
    "35 ans et moins": "#4B9DFF",
    "36 à 55 ans": "#000091",
    "56 ans et plus": "#6A6AF4",
    "Non précisé": "#78022C",
  };

  const ageClassOrder = [
    "35 ans et moins",
    "36 à 55 ans",
    "56 ans et plus",
    "Non précisé",
  ];

  const series = ageClassOrder.map((ageClass) => {
    const data = ageData[ageClass] || [];

    return {
      name: ageClass,
      data: data,
      color: ageColors[ageClass],
      type: "area" as const,
    };
  });

  const getTitle = () => {
    if (contextName) {
      const contextLabel = {
        discipline: "discipline",
        région: "région",
        établissement: "établissement",
      }[contextType];

      return `Évolution de la pyramide des âges - ${contextLabel} ${contextName}`;
    }
    return "Évolution de la pyramide des âges du personnel enseignant";
  };

  const getSubtitle = () => {
    if (years.length > 0) {
      return `Période de ${years[0]} à ${years[years.length - 1]}`;
    }
    return "";
  };

  return CreateChartOptions("area", {
    chart: {
      height: 500,
      type: "area",
      marginLeft: 60,
      spacing: [20, 20, 20, 20],
    },
    title: {
      text: getTitle(),
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#161616",
      },
    },
    subtitle: {
      text: getSubtitle(),
      style: {
        fontSize: "14px",
        color: "#666666",
      },
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
      max: 100,
      title: {
        text: "Répartition (%)",
        style: {
          fontSize: "12px",
          color: "#666666",
        },
      },
      labels: {
        formatter: function () {
          return this.value + "%";
        },
        style: { fontSize: "11px" },
      },
      gridLineColor: "#F0F0F0",
      gridLineDashStyle: "Dot",
    },
    tooltip: {
      shared: true,
      formatter: function () {
        let tooltip = `<b>Année ${this.x}</b><br/>`;

        const sortedPoints =
          this.points?.sort((a, b) => (b.y || 0) - (a.y || 0)) || [];

        sortedPoints.forEach((point) => {
          tooltip += `<span style="color:${point.color}">●</span> ${
            point.series.name
          }: <b>${(point.y || 0).toFixed(1)}%</b><br/>`;
        });

        return tooltip;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#CCCCCC",
      borderRadius: 8,
      shadow: true,
    },
    plotOptions: {
      area: {
        stacking: "percent",
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
          },
        },
        fillOpacity: 0.7,
      },
    },
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
    series: series,
    credits: { enabled: false },
  });
}

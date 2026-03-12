import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-ep";
import type { DestinationChartItem } from "./query";
import { formatCurrency, formatToRates } from "../../../../../../utils/format";

// Mapping des codes de destination vers des noms lisibles
const DESTINATION_NAMES: Record<string, { fr: string; en: string }> = {
  STG: { fr: "Starting Grants", en: "Starting Grants" },
  COG: { fr: "Consolidator Grants", en: "Consolidator Grants" },
  ADG: { fr: "Advanced Grants", en: "Advanced Grants" },
  SYG: { fr: "Synergy Grants", en: "Synergy Grants" },
  POC: { fr: "Proof of Concept", en: "Proof of Concept" },
};

// Ordre de tri des destinations
const DESTINATION_ORDER = ["STG", "COG", "ADG", "SYG", "POC"];

interface OptionsParams {
  data: DestinationChartItem[];
  currentLang?: string;
}

export default function OptionsFunding({ data, currentLang = "fr" }: OptionsParams) {
  if (!data || data.length === 0) return null;

  // Trier les données selon l'ordre défini
  const sortedData = [...data].sort((a, b) => {
    const indexA = DESTINATION_ORDER.indexOf(a.destination_code);
    const indexB = DESTINATION_ORDER.indexOf(b.destination_code);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  // Préparer les catégories (codes de destination)
  const categories = sortedData.map((d) => d.destination_code);

  // Préparer les données pour les barres (en millions d'euros)
  const evaluatedData = sortedData.map((d) => (d.evaluated?.total_funding_entity || 0) / 1000000);
  const successfulData = sortedData.map((d) => (d.successful?.total_funding_entity || 0) / 1000000);

  // Calculer les taux de succès (basé sur les financements)
  const successRates = sortedData.map((d) => {
    const evaluated = d.evaluated?.total_funding_entity || 0;
    const successful = d.successful?.total_funding_entity || 0;
    return evaluated > 0 ? (successful / evaluated) * 100 : 0;
  });

  // Récupérer les couleurs CSS
  const rootStyles = getComputedStyle(document.documentElement);
  const evaluatedColor = rootStyles.getPropertyValue("--evaluated-project-color").trim() || "#009099";
  const successfulColor = rootStyles.getPropertyValue("--successful-project-color").trim() || "#233e41";
  const successRateColor = rootStyles.getPropertyValue("--averageSuccessRate-color").trim() || "#d75521";

  const titleText = currentLang === "fr" ? "Financements par type de financement ERC" : "Funding by ERC funding type";

  const newOptions: HighchartsInstance.Options = {
    chart: {
      height: 400,
    },
    title: {
      text: titleText,
      style: {
        fontSize: "14px",
        fontWeight: "600",
      },
    },
    xAxis: {
      categories,
      crosshair: true,
      labels: {
        formatter: function () {
          const code = this.value as string;
          return DESTINATION_NAMES[code]?.[currentLang] || code;
        },
        style: { fontSize: "12px" },
      },
    },
    yAxis: [
      {
        // Axe principal pour les financements
        title: {
          text: currentLang === "fr" ? "Financements (M€)" : "Funding (M€)",
          style: { fontSize: "13px" },
        },
        min: 0,
        labels: {
          formatter: function () {
            return `${this.value} M€`;
          },
        },
      },
      {
        // Axe secondaire pour le taux de succès
        title: {
          text: currentLang === "fr" ? "Taux de succès (%)" : "Success rate (%)",
          style: { fontSize: "13px", color: successRateColor },
        },
        opposite: true,
        min: 0,
        max: 100,
        labels: {
          format: "{value}%",
          style: { color: successRateColor },
        },
      },
    ],
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        const points = this.points;
        if (!points) return "";

        const destinationCode = String(this.x);
        const destinationName = DESTINATION_NAMES[destinationCode]?.[currentLang] || destinationCode;

        let html = `<strong>${destinationName}</strong><br/>`;

        points.forEach((point) => {
          const seriesName = point.series.name;
          const value = point.y || 0;

          if (point.series.type === "line") {
            html += `<span style="color:${point.color}">●</span> ${seriesName}: <strong>${formatToRates(value / 100)}</strong><br/>`;
          } else {
            html += `<span style="color:${point.color}">●</span> ${seriesName}: <strong>${formatCurrency(value * 1000000)}</strong><br/>`;
          }
        });

        return html;
      },
    },
    plotOptions: {
      column: {
        grouping: true,
        borderWidth: 0,
        borderRadius: 2,
      },
      line: {
        marker: {
          enabled: true,
          radius: 5,
        },
        lineWidth: 2,
      },
    },
    series: [
      {
        type: "column",
        name: currentLang === "fr" ? "Financements demandés" : "Requested funding",
        color: evaluatedColor,
        data: evaluatedData,
        yAxis: 0,
      },
      {
        type: "column",
        name: currentLang === "fr" ? "Financements obtenus" : "Obtained funding",
        color: successfulColor,
        data: successfulData,
        yAxis: 0,
      },
      {
        type: "line",
        name: currentLang === "fr" ? "Taux de succès" : "Success rate",
        color: successRateColor,
        data: successRates,
        yAxis: 1,
        marker: {
          symbol: "circle",
        },
        zIndex: 5,
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}

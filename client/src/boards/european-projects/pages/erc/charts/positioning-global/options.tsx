import Highcharts from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-ep";
import type { ProcessedPositioningData } from "./utils";
import { COLORS } from "./utils";

interface OptionsParams {
  processedData: ProcessedPositioningData;
  currentLang?: string;
}

export default function Options({ processedData, currentLang = "fr" }: OptionsParams): Highcharts.Options | null {
  if (!processedData || processedData.countries.length === 0) return null;

  const titleText =
    currentLang === "fr"
      ? processedData.metric === "projects"
        ? "Classement des pays par nombre de porteurs de projets ERC lauréats"
        : "Classement des pays par montant de financements ERC obtenus"
      : processedData.metric === "projects"
        ? "Country ranking by number of successful ERC project PIs"
        : "Country ranking by ERC funding amount obtained";

  const yAxisLabel =
    currentLang === "fr"
      ? processedData.metric === "projects"
        ? "Nombre de porteurs de projets"
        : "Financements (M€)"
      : processedData.metric === "projects"
        ? "Number of project PIs"
        : "Funding (M€)";

  // Préparer les données pour le graphique à barres horizontales
  const categories = processedData.countries.map((c) => c.name);
  const dataPoints = processedData.countries.map((c) => ({
    y: processedData.metric === "funding" ? c.value / 1_000_000 : c.value,
    color: c.isSelected ? COLORS.selectedCountry : COLORS.otherCountries,
    name: c.name,
  }));

  const newOptions: Highcharts.Options = {
    chart: {
      height: 450,
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
      title: {
        text: "",
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yAxis: {
      title: {
        text: yAxisLabel,
      },
      labels: {
        format: processedData.metric === "funding" ? "{value} M€" : "{value}",
        style: {
          fontSize: "12px",
        },
      },
      min: 0,
      gridLineWidth: 0.5,
      gridLineColor: "#e0e0e0",
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        const ctx = this as unknown as { x: string; y: number };
        const value = processedData.metric === "funding" ? `${ctx.y.toFixed(1)} M€` : `${ctx.y}`;
        return `<b>${ctx.x}</b><br/>${yAxisLabel}: ${value}`;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: processedData.metric === "funding" ? "{y:.1f} M€" : "{y}",
          style: {
            fontSize: "11px",
            fontWeight: "normal",
          },
        },
        borderRadius: 3,
      },
    },
    series: [
      {
        type: "bar",
        name: yAxisLabel,
        data: dataPoints,
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
}

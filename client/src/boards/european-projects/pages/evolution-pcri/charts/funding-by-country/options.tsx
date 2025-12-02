import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToMillions } from "../../../../../../utils/format";
import { getColorByFramework } from "./utils";
import type { EvolutionDataItem } from "./types";
import i18n from "./i18n.json";

interface YearData {
  year: string;
  funding: number;
  framework: string;
}

export default function Options(data: EvolutionDataItem[], currentLang: string = "fr") {
  if (!data || data.length === 0) return null;

  function getI18nLabel(key: string): string {
    return i18n[key]?.[currentLang] || i18n[key]?.["fr"] || key;
  }

  // Grouper les données par call_year
  const dataByYear: Record<string, YearData> = data.reduce((acc, item) => {
    if (!acc[item.call_year]) {
      acc[item.call_year] = {
        year: item.call_year,
        funding: 0,
        framework: item.framework,
      };
    }
    acc[item.call_year].funding += item.funding || 0;
    return acc;
  }, {} as Record<string, YearData>);

  // Convertir en tableau et trier par année
  const sortedData = Object.values(dataByYear).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Extraire les catégories (années)
  const categories = sortedData.map((item) => item.year);

  // Préparer les données pour le graphique avec les couleurs
  const chartData = sortedData.map((item) => ({
    y: item.funding,
    color: getColorByFramework(item.framework),
  }));

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "column",
      height: 500,
    },
    title: {
      text: undefined, // Le titre est géré par ChartWrapper
    },
    xAxis: {
      categories: categories,
      title: {
        text: getI18nLabel("x-axis-title"),
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: "10px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: getI18nLabel("y-axis-title"),
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormatter: function () {
        return `${getI18nLabel("tooltip-funding")} : <b>${formatToMillions(this.y ?? 0)}</b>`;
      },
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return formatToMillions(this.y ?? 0);
          },
          style: {
            fontSize: "9px",
            fontWeight: "normal",
          },
        },
        borderWidth: 0,
      },
    },
    series: [
      {
        type: "column",
        name: getI18nLabel("series-name"),
        data: chartData,
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}

import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import type { EvolutionDataItem } from "./types";
import i18n from "./i18n.json";

export default function Options(data: EvolutionDataItem[], currentLang: string = "fr") {
  if (!data || data.length === 0) return null;

  function getI18nLabel(key: string): string {
    return i18n[key]?.[currentLang] || i18n[key]?.["fr"] || key;
  }

  interface CountryData {
    country: string;
    countryCode: string;
    evaluated: number;
    successful: number;
    successfulFunding: number;
    successfulShare: number;
    successRate: number;
  }

  // Grouper les données par pays
  const dataByCountry: Record<string, CountryData> = data
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE") // Exclure "Tous pays" et "Etats membres & associés"
    .reduce((acc, item) => {
      if (!acc[item.country_code]) {
        acc[item.country_code] = {
          country: currentLang === "fr" ? item.country_name_fr : item.country_code,
          countryCode: item.country_code,
          evaluated: 0,
          successful: 0,
          successfulFunding: 0,
          successfulShare: 0,
          successRate: 0,
        };
      }
      if (item.stage === "evaluated") {
        acc[item.country_code].evaluated += item.project_number || 0;
      } else if (item.stage === "successful") {
        acc[item.country_code].successful += item.project_number || 0;
        acc[item.country_code].successfulFunding += item.funding || 0;
        acc[item.country_code].successfulShare += item.share_funding || 0;
      }
      return acc;
    }, {} as Record<string, CountryData>);

  // Calculer le taux de succès
  Object.values(dataByCountry).forEach((country) => {
    if (country.evaluated > 0) {
      country.successRate = (country.successful / country.evaluated) * 100;
    }
  });

  // Filtrer les pays valides et prendre les top 20 par financement
  const validCountries = Object.values(dataByCountry)
    .filter((c) => c.successRate > 0 && c.successfulFunding > 0)
    .sort((a, b) => b.successfulFunding - a.successfulFunding)
    .slice(0, 20);

  // Préparer les données pour le scatter
  const scatterData = validCountries.map((country) => ({
    x: country.successRate,
    y: country.successfulShare * 100, // Convertir en pourcentage
    z: country.successful, // Taille de la bulle = nombre de projets
    name: country.country,
    country: country.country,
    successRate: country.successRate,
    fundingShare: country.successfulShare * 100,
    projects: country.successful,
  }));

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "bubble",
      height: 600,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      min: 0,
      max: 100,
      title: {
        text: getI18nLabel("x-axis-title"),
      },
      gridLineWidth: 1,
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
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
        `<tr><th>${getI18nLabel("tooltip-success-rate")}:</th><td><b>{point.successRate:.1f}%</b></td></tr>` +
        `<tr><th>${getI18nLabel("tooltip-funding-share")}:</th><td><b>{point.fundingShare:.2f}%</b></td></tr>` +
        `<tr><th>${getI18nLabel("tooltip-projects")}:</th><td><b>{point.projects}</b></td></tr>`,
      footerFormat: "</table>",
      followPointer: true,
    },
    plotOptions: {
      bubble: {
        minSize: 10,
        maxSize: 60,
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            fontSize: "9px",
            fontWeight: "normal",
            textOutline: "1px contrast",
          },
        },
      },
    },
    series: [
      {
        type: "bubble",
        name: getI18nLabel("tooltip-country"),
        data: scatterData,
        color: "rgba(220, 53, 69, 0.5)",
      },
    ],
  };

  return CreateChartOptions("bubble", newOptions);
}

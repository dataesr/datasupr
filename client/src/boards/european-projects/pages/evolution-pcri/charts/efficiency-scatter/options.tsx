import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import type { EvolutionDataItem } from "./types";
import i18n from "./i18n.json";

// Ordre des frameworks pour l'animation
export const FRAMEWORKS_ORDER = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];

// Labels d'affichage des frameworks
export const FRAMEWORK_LABELS: Record<string, string> = {
  FP6: "FP6 (2002-2006)",
  FP7: "FP7 (2007-2013)",
  "Horizon 2020": "Horizon 2020 (2014-2020)",
  "Horizon Europe": "Horizon Europe (2021-2027)",
};

// Fonction pour calculer les données agrégées par pays pour un ensemble de données
function computeCountryData(
  dataSet: EvolutionDataItem[],
  currentLang: string,
): { dataByCountry: Record<string, { country: string; countryCode: string; evaluated: number; successful: number; successfulFunding: number; successfulShare: number; successRate: number }>; totalFunding: number } {
  const totalFunding = dataSet
    .filter((item) => item.country_code === "ALL" && item.stage === "successful")
    .reduce((sum, item) => sum + (item.funding || 0), 0);

  const dataByCountry = dataSet
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE")
    .reduce(
      (acc, item) => {
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
        }
        return acc;
      },
      {} as Record<string, { country: string; countryCode: string; evaluated: number; successful: number; successfulFunding: number; successfulShare: number; successRate: number }>,
    );

  Object.values(dataByCountry).forEach((country) => {
    if (country.evaluated > 0) {
      country.successRate = (country.successful / country.evaluated) * 100;
    }
    if (totalFunding > 0) {
      country.successfulShare = (country.successfulFunding / totalFunding) * 100;
    }
  });

  return { dataByCountry, totalFunding };
}

// Fonction pour calculer les limites globales des axes (min/max) sur tous les frameworks
function computeGlobalAxisLimits(data: EvolutionDataItem[], currentLang: string): { xMin: number; xMax: number; yMax: number } {
  let allSuccessRates: number[] = [];
  let allFundingShares: number[] = [];

  // Calculer pour chaque framework individuellement
  for (const framework of FRAMEWORKS_ORDER) {
    const frameworkData = data.filter((item) => item.framework === framework);
    if (frameworkData.length === 0) continue;

    const { dataByCountry } = computeCountryData(frameworkData, currentLang);

    const validCountries = Object.values(dataByCountry)
      .filter((c) => c.successRate > 0 && c.successfulFunding > 0)
      .sort((a, b) => b.successfulFunding - a.successfulFunding)
      .slice(0, 15);

    validCountries.forEach((c) => {
      allSuccessRates.push(c.successRate);
      allFundingShares.push(c.successfulShare);
    });
  }

  // Aussi calculer pour "tous les frameworks" agrégés
  const { dataByCountry: allDataByCountry } = computeCountryData(data, currentLang);
  const allValidCountries = Object.values(allDataByCountry)
    .filter((c) => c.successRate > 0 && c.successfulFunding > 0)
    .sort((a, b) => b.successfulFunding - a.successfulFunding)
    .slice(0, 15);

  allValidCountries.forEach((c) => {
    allSuccessRates.push(c.successRate);
    allFundingShares.push(c.successfulShare);
  });

  if (allSuccessRates.length === 0) {
    return { xMin: 0, xMax: 100, yMax: 50 };
  }

  const xMin = Math.floor(Math.min(...allSuccessRates) - 2);
  const xMax = Math.ceil(Math.max(...allSuccessRates) + 2);
  const yMax = Math.ceil(Math.max(...allFundingShares) + 2);

  return { xMin: Math.max(0, xMin), xMax: Math.min(100, xMax), yMax };
}

export default function Options(data: EvolutionDataItem[], currentLang: string = "fr", selectedFramework: string | null = null) {
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

  // Calculer les limites globales des axes (basées sur TOUS les frameworks)
  const { xMin, xMax, yMax } = computeGlobalAxisLimits(data, currentLang);

  // Filtrer les données par framework si un framework est sélectionné
  const filteredData = selectedFramework ? data.filter((item) => item.framework === selectedFramework) : data;

  // Calculer le total global du financement (country_code = ALL)
  const totalFunding = filteredData
    .filter((item) => item.country_code === "ALL" && item.stage === "successful")
    .reduce((sum, item) => sum + (item.funding || 0), 0);

  // Grouper les données par pays
  const dataByCountry: Record<string, CountryData> = filteredData
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE") // Exclure "Tous pays" et "Etats membres & associés"
    .reduce(
      (acc, item) => {
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
        }
        return acc;
      },
      {} as Record<string, CountryData>,
    );

  // Calculer le taux de succès et recalculer les parts correctement
  Object.values(dataByCountry).forEach((country) => {
    if (country.evaluated > 0) {
      country.successRate = (country.successful / country.evaluated) * 100;
    }
    if (totalFunding > 0) {
      country.successfulShare = (country.successfulFunding / totalFunding) * 100;
    }
  });

  // Filtrer les pays valides et prendre les top 20 par financement
  const validCountries = Object.values(dataByCountry)
    .filter((c) => c.successRate > 0 && c.successfulFunding > 0)
    .sort((a, b) => b.successfulFunding - a.successfulFunding)
    .slice(0, 15);

  // Préparer les données pour le scatter
  const frameworkLabel = selectedFramework ? FRAMEWORK_LABELS[selectedFramework] || selectedFramework : getI18nLabel("tooltip-all-frameworks");

  const scatterData = validCountries.map((country) => ({
    x: country.successRate,
    y: country.successfulShare, // Déjà en pourcentage
    z: country.successful, // Taille de la bulle = nombre de projets
    name: country.country,
    country: country.country,
    successRate: country.successRate,
    fundingShare: country.successfulShare,
    projects: country.successful,
    framework: frameworkLabel,
  }));

  // Couleurs par framework
  const frameworkColors: Record<string, string> = {
    FP6: "rgba(0, 145, 179, 0.6)",
    FP7: "rgba(102, 102, 255, 0.6)",
    H2020: "rgba(255, 153, 0, 0.6)",
    "HORIZON EUROPE": "rgba(220, 53, 69, 0.6)",
  };

  const seriesColor = selectedFramework ? frameworkColors[selectedFramework] || "rgba(220, 53, 69, 0.5)" : "rgba(220, 53, 69, 0.5)";

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "bubble",
      height: 600,
      animation: {
        duration: 800,
      },
    },
    title: {
      text: selectedFramework ? FRAMEWORK_LABELS[selectedFramework] : undefined,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      min: xMin,
      max: xMax,
      title: {
        text: getI18nLabel("x-axis-title"),
      },
      gridLineWidth: 1,
      labels: {
        format: "{value}%",
      },
    },
    yAxis: {
      min: 0,
      max: yMax,
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
        `<tr><th>${getI18nLabel("tooltip-framework")}:</th><td><b>{point.framework}</b></td></tr>` +
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
        color: seriesColor,
      },
    ],
  };

  return CreateChartOptions("bubble", newOptions);
}

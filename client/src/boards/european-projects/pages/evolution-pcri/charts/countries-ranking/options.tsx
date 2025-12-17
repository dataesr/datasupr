import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToMillions } from "../../../../../../utils/format";
import { getFlagEmoji } from "../../../../../../utils";
import allCountries from "../../../../../../components/country-selector/all-countries.json";
import type { EvolutionDataItem } from "./types";
import i18n from "./i18n.json";

// Fonction pour convertir ISO3 vers ISO2
function getIso2(iso3: string): string | undefined {
  return allCountries.find((country) => country.cca3 === iso3)?.cca2;
}

export default function Options(data: EvolutionDataItem[], currentLang: string = "fr") {
  if (!data || data.length === 0) return null;

  function getI18nLabel(key: string): string {
    return i18n[key]?.[currentLang] || i18n[key]?.["fr"] || key;
  }

  interface CountryFrameworkData {
    country: string;
    countryCode: string;
    framework: string;
    funding: number;
  }

  // Grouper les données par pays et framework
  const dataByCountryFramework: Record<string, CountryFrameworkData> = data
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE") // Exclure "Tous pays" et "Etats membres & associés"
    .reduce((acc, item) => {
      const key = `${item.country_code}_${item.framework}`;
      if (!acc[key]) {
        acc[key] = {
          country: currentLang === "fr" ? item.country_name_fr : item.country_code,
          countryCode: item.country_code,
          framework: item.framework,
          funding: 0,
        };
      }
      acc[key].funding += item.funding || 0;
      return acc;
    }, {} as Record<string, CountryFrameworkData>);

  const frameworkOrder = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];

  // Calculer le classement pour chaque framework et ne garder que les top 15
  const rankings: Record<string, Array<{ country: string; countryCode: string; funding: number; rank: number }>> = {};

  frameworkOrder.forEach((framework) => {
    const frameworkData = Object.values(dataByCountryFramework)
      .filter((item) => item.framework === framework)
      .sort((a, b) => b.funding - a.funding)
      .slice(0, 15) // Top 15
      .map((item, index) => ({
        country: item.country,
        countryCode: item.countryCode,
        funding: item.funding,
        rank: index + 1,
      }));
    rankings[framework] = frameworkData;
  });

  // Identifier tous les pays qui apparaissent dans au moins un top 15
  const allTopCountries = new Set<string>();
  Object.values(rankings).forEach((rankList) => {
    rankList.forEach((item) => allTopCountries.add(item.countryCode));
  });

  // Créer une série par pays
  const series = Array.from(allTopCountries).map((countryCode) => {
    const countryName = data.find((d) => d.country_code === countryCode)?.country_name_fr || countryCode;
    const iso2 = getIso2(countryCode);
    const flag = iso2 ? getFlagEmoji(iso2) : "";

    const countryData = frameworkOrder.map((framework, index) => {
      const rank = rankings[framework]?.find((r) => r.countryCode === countryCode);
      const isLastPoint = index === frameworkOrder.length - 1;

      if (!rank) return null;

      // Pour le dernier point, ajouter le drapeau comme dataLabel
      if (isLastPoint) {
        return {
          y: rank.rank,
          dataLabels: {
            enabled: true,
            format: flag,
            style: {
              fontSize: "20px",
              textOutline: "none",
            },
            align: "left", // Aligner à gauche du point
            verticalAlign: "middle", // Centrer verticalement
            y: 0,
            x: 10, // Décalage de 10px à droite du point
          },
          marker: {
            enabled: true, // Afficher le marker pour le dernier point
            radius: 4,
          },
        };
      }

      return rank.rank;
    });

    return {
      name: currentLang === "fr" ? countryName : countryCode,
      data: countryData,
      type: "line" as const,
    };
  });

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "line",
      height: 600,
      spacingTop: 30, // Augmente la marge supérieure pour afficher le premier drapeau
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: frameworkOrder,
      title: {
        text: getI18nLabel("x-axis-title"),
      },
    },
    yAxis: {
      min: 1,
      max: 15,
      reversed: true, // Le 1er est en haut
      title: {
        text: getI18nLabel("y-axis-title"),
      },
      tickInterval: 1,
    },
    legend: {
      enabled: true,
      align: "right",
      layout: "vertical",
      verticalAlign: "middle",
    },
    tooltip: {
      formatter: function () {
        const frameworkIndex = this.index;
        const framework = frameworkOrder[frameworkIndex];
        const countryName = this.series.name;
        const rank = this.y;

        // Trouver le financement pour ce pays et framework
        const countryCode = data.find((d) => (currentLang === "fr" ? d.country_name_fr : d.country_code) === countryName)?.country_code;

        const funding = rankings[framework]?.find((r) => r.countryCode === countryCode)?.funding || 0;

        return `<b>${getI18nLabel("tooltip-country")}</b>: ${countryName}<br/>
                <b>${getI18nLabel("tooltip-rank")}</b>: ${rank}<br/>
                <b>${getI18nLabel("tooltip-funding")}</b>: ${formatToMillions(funding)}`;
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4,
        },
        lineWidth: 2,
        dataLabels: {
          allowOverlap: true, // Permet aux labels de se chevaucher
          crop: false, // Ne coupe pas les labels qui dépassent
          overflow: "allow", // Permet aux labels de dépasser la zone du graphique
        },
      },
    },
    series: series,
  };

  return CreateChartOptions("line", newOptions);
}

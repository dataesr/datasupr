import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-ep";

import { formatToMillions } from "../../../../../../utils/format";
import type { HighchartsOptions } from "../../../../../../components/chart-wrapper";

import i18nGlobal from "../../../../i18n-global.json";

export default function Options(data, displayType, currentLang): HighchartsOptions {
  if (!data) return null;
  // TODO: translations
  const rootStyles = getComputedStyle(document.documentElement);

  function getI18nLabel(key) {
    return i18nGlobal[key][currentLang];
  }

  const years = new Set();
  const filteredData = data.filter((item) => item.country !== "all")[0].data;
  const evaluatedData = filteredData.find((item) => item.stage === "evaluated");
  const successfulData = filteredData.find((item) => item.stage === "successful");

  evaluatedData.pillars[0].years.forEach((year) => years.add(year.year));

  // Créer les catégories combinées : Année - Pilier
  const categories: string[] = [];
  const sortedYears = Array.from(years).sort();

  sortedYears.forEach((year) => {
    evaluatedData.pillars.forEach((pillar) => {
      categories.push(`${year} - ${pillar.pilier_name_fr}`);
    });
  });

  const newOptions: HighchartsInstance.Options = {
    xAxis: {
      // categories: categories,
      categories: sortedYears.map(String),
      labels: {
        rotation: -45,
        style: {
          fontSize: "10px",
        },
      },
    },
    yAxis: [
      {
        min: 0,
        title: {
          text: displayType === "total_fund_eur" ? "M€" : "Nombre",
        },
      },
      {
        min: 0,
        max: 100,
        title: {
          text: `${getI18nLabel("success-rate")} (%)`,
        },
        opposite: true,
        labels: {
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            return `${this.value}%`;
          },
        },
      },
    ],
    legend: {
      enabled: true,
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        grouping: false,
        shadow: false,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return displayType === "total_fund_eur" ? formatToMillions(this.y as number) : (this.y as number);
          },
        },
      },
    },
    series: [
      // Série pour les projets évalués
      {
        type: "column",
        name: getI18nLabel("evaluated-projects"),
        color: rootStyles.getPropertyValue("--evaluated-project-color") || "#009099",
        data: (() => {
          const data: number[] = [];
          sortedYears.forEach((year) => {
            evaluatedData.pillars.forEach((pillar) => {
              const yearData = pillar.years.find((y) => y.year === year);
              data.push(yearData ? yearData[displayType] : 0);
            });
          });
          return data;
        })(),
        pointPadding: 0.3,
        pointPlacement: -0.2,
      },
      // Série pour les projets lauréats
      {
        type: "column",
        name: getI18nLabel("successful-projects"),
        color: rootStyles.getPropertyValue("--successful-project-color") || "#233e41",
        data: (() => {
          const data: number[] = [];
          sortedYears.forEach((year) => {
            successfulData.pillars.forEach((pillar) => {
              const yearData = pillar.years.find((y) => y.year === year);
              data.push(yearData ? yearData[displayType] : 0);
            });
          });
          return data;
        })(),
        pointPadding: 0.3,
        pointPlacement: 0.2,
      },
      // Série pour les taux de succès
      {
        type: "line",
        name: `${getI18nLabel("success-rate")} (%)`,
        color: rootStyles.getPropertyValue("--successRate-color") || "#1f8d49",
        yAxis: 1,
        data: (() => {
          const data: number[] = [];
          sortedYears.forEach((year) => {
            evaluatedData.pillars.forEach((pillar) => {
              const evaluatedYearData = pillar.years.find((y) => y.year === year);
              const successfulPillar = successfulData.pillars.find((p) => p.pilier_code === pillar.pilier_code);
              const successfulYearData = successfulPillar ? successfulPillar.years.find((y) => y.year === year) : null;
              const evaluatedValue = evaluatedYearData ? evaluatedYearData[displayType] : 0;
              const successfulValue = successfulYearData ? successfulYearData[displayType] : 0;
              const successRate = evaluatedValue > 0 ? (successfulValue / evaluatedValue) * 100 : 0;
              data.push(successRate);
            });
          });
          return data;
        })(),
        marker: {
          enabled: true,
          radius: 4,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return `${Number(this.y).toFixed(1)}%`;
          },
        },
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}

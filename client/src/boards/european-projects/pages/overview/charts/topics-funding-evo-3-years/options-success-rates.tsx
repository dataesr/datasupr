import type HighchartsInstance from "highcharts/es-modules/masters/highcharts.src.js";
import type { HighchartsOptions } from "../../../../../../components/chart-wrapper";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { getI18nLabel } from "../../../../../../utils";
import i18n from "../../i18n-charts.json";
import { normalizeIdForCssColorNames } from "../../../../utils";

export default function Options(data, displayType, currentLang): HighchartsOptions {
  if (!data || !Array.isArray(data)) return null;

  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const countryData = data.filter((item) => item.country !== "all")[0];
  const allCountryData = data.find((item) => item.country === "all");

  if (!countryData?.data || !allCountryData?.data) return null;

  const filteredData = countryData.data;
  const allData = allCountryData.data;

  const evaluatedFiltered = filteredData.find((item) => item.stage === "evaluated");
  const successfulFiltered = filteredData.find((item) => item.stage === "successful");
  const evaluatedAll = allData.find((item) => item.stage === "evaluated");
  const successfulAll = allData.find((item) => item.stage === "successful");

  if (!evaluatedFiltered?.topics?.length || !successfulFiltered?.topics?.length) return null;
  if (!evaluatedAll?.topics?.length || !successfulAll?.topics?.length) return null;

  evaluatedFiltered.topics[0].years.forEach((year) => years.add(year.year));

  // Pour les topics multiples, on construit les séries dynamiquement
  const evaluatedTopics = evaluatedFiltered.topics;
  const successfulTopics = successfulFiltered.topics;
  const evaluatedAllTopics = evaluatedAll.topics;
  const successfulAllTopics = successfulAll.topics;

  const newOptions: HighchartsInstance.Options = {
    title: { text: "" },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
    },
    yAxis: {
      gridLineColor: "var(--background-default-grey-hover)",
      gridLineWidth: 0.5,
    },
    xAxis: [
      {
        type: "category" as const,
        categories: Array.from(years).map(String),
        width: "48%",
        gridLineWidth: 0,
      },
      {
        type: "category" as const,
        categories: Array.from(years).map(String),
        offset: 0,
        left: "50%",
        width: "48%",
      },
    ],
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 3,
          lineWidth: 2,
          lineColor: undefined,
        },

        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${Number(this.y).toFixed(1)}%`;
          },
        },
      },
    },
    tooltip: {
      shared: true,
      formatter: function () {
        let s = `<b>${this.x}</b>`; // annee

        this.points?.forEach((point) => {
          s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${Number(point.y).toFixed(1)}%</b>`;
        });

        return s;
      },
    },
    series: evaluatedTopics
      .map((topic) => {
        const allTopicData = evaluatedAllTopics.find((t) => t.thema_code === topic.thema_code);
        const topicName = currentLang === "fr" ? topic.thema_name_fr : topic.thema_name_en;

        return {
          color: rootStyles.getPropertyValue(`--topic-${normalizeIdForCssColorNames(topic.thema_code)}-color`),
          name: `${topicName} - ${getI18nLabel(i18n, "evaluatedProjects", currentLang)}`,
          data: topic.years.map((year, index) => {
            const totalForYear = allTopicData?.years[index]?.[displayType] || 1;
            return totalForYear > 0 ? (year[displayType] / totalForYear) * 100 : 0;
          }),
        };
      })
      .concat(
        successfulTopics.map((topic) => {
          const allTopicData = successfulAllTopics.find((t) => t.thema_code === topic.thema_code);
          const topicName = currentLang === "fr" ? topic.thema_name_fr : topic.thema_name_en;

          return {
            xAxis: 1,
            name: `${topicName} - ${getI18nLabel(i18n, "successfulProjects", currentLang)}`,
            data: topic.years.map((year, index) => {
              const totalForYear = allTopicData?.years[index]?.[displayType] || 1;
              return totalForYear > 0 ? (year[displayType] / totalForYear) * 100 : 0;
            }),
            color: rootStyles.getPropertyValue(`--topic-${normalizeIdForCssColorNames(topic.thema_code)}-color`),
          };
        }),
      ),
  };
  return CreateChartOptions("line", newOptions);
}

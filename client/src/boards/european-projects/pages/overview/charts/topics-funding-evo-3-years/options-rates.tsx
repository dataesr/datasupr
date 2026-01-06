import { normalizeIdForCssColorNames } from "../../../../utils";
import type { HighchartsOptions } from "../../../../../../components/chart-wrapper";

export default function Options(data, displayType): HighchartsOptions {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const countryData = data.filter((item) => item.country !== "all")[0].data;

  countryData.find((item) => item.stage === "evaluated").topics[0].years.forEach((year) => years.add(year.year));

  return {
    chart: {
      type: "line",
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },
    xAxis: [
      {
        type: "category" as const,
        categories: Array.from(years).map(String),
        width: "100%",
        title: {
          text: "Projets évalués",
        },
      },
    ],
    // yAxis: [
    //   {
    //     lineWidth: 1,
    //     lineColor: "#E6E6E6",
    //     min: 0,
    //     max: 100,
    //     title: {
    //       text: "%",
    //     },
    //   },
    //   {
    //     min: 0,
    //     max: 100,
    //     title: {
    //       text: "",
    //     },
    //     lineWidth: 1,
    //     lineColor: "#E6E6E6",
    //     left: "75%",
    //   },
    // ],
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
          formatter: function (this: any) {
            return `${Number(this.y).toFixed(1)}%`;
          },
        },
      },
    },
    series: countryData
      .find((item) => item.stage === "evaluated")
      .topics.map((topic) => {
        const successfulPillarData = countryData.find((item) => item.stage === "successful").topics.find((p) => p.thema_code === topic.thema_code);

        return {
          name: topic.thema_name_fr,
          data: topic.years.map((year, index) => {
            const evaluatedAmount = year[displayType];
            const successfulAmount = successfulPillarData.years[index][displayType];
            return evaluatedAmount > 0 ? (successfulAmount / evaluatedAmount) * 100 : 0;
          }),
          color: rootStyles.getPropertyValue(`--topic-${normalizeIdForCssColorNames(topic.thema_code)}-color`),
        };
      }),
  } as HighchartsOptions;
}

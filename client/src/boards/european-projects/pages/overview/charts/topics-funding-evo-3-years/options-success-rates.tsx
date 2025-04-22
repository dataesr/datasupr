// import { formatToPercentage } from "../../../../../../utils/format";

import { normalizeIdForCssColorNames } from "../../../../utils";

export default function Options(data, displayType) {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const filteredData = data.filter((item) => item.country !== "all")[0].data;
  const allData = data.find((item) => item.country === "all").data;

  filteredData
    .find((item) => item.stage === "evaluated")
    .topics[0].years.forEach((year) => years.add(year.year));

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
        type: "category",
        categories: Array.from(years),
        width: "48%",
        title: {
          text: "Projets évalués",
        },
      },
      {
        type: "category",
        categories: Array.from(years),
        offset: 0,
        left: "50%",
        width: "48%",
        title: {
          text: "Projets lauréats",
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
    //     left: "50%",
    //   },
    // ],
    // tooltip: {
    //   valueSuffix: "%",
    //   formatter: function () {
    //     return `${this.series.name}: ${Number(this.y).toFixed(1)}%`;
    //   },
    // },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 3,
          lineWidth: 2,
          lineColor: null,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return `${Number(this.y).toFixed(1)}%`;
          },
        },
      },
    },
    series: filteredData
      .find((item) => item.stage === "evaluated")
      .topics.map((topics) => {
        const allPillarData = allData
          .find((item) => item.stage === "evaluated")
          .topics.find((p) => p.thema_code === topics.thema_code);

        return {
          name: topics.thema_name_fr,
          data: topics.years.map((year, index) => {
            const totalForYear = allPillarData.years[index][displayType];
            return totalForYear > 0
              ? (year[displayType] / totalForYear) * 100
              : 0;
          }),
          color: rootStyles.getPropertyValue(
            `--topic-${normalizeIdForCssColorNames(topics.thema_code)}-color`
          ),
        };
      })
      .concat(
        filteredData
          .find((item) => item.stage === "successful")
          .topics.map((topics) => {
            const allPillarData = allData
              .find((item) => item.stage === "successful")
              .topics.find((p) => p.thema_code === topics.thema_code);

            return {
              xAxis: 1,
              name: topics.thema_name_fr,
              data: topics.years.map((year, index) => {
                const totalForYear = allPillarData.years[index][displayType];
                return totalForYear > 0
                  ? (year[displayType] / totalForYear) * 100
                  : 0;
              }),
              color: rootStyles.getPropertyValue(
                `--topic-${normalizeIdForCssColorNames(
                  topics.thema_code
                )}-color`
              ),
            };
          })
      ),
  };
}

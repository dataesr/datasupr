import { formatToMillions } from "../../../../../../utils/format";
import { normalizeIdForCssColorNames } from "../../../../utils";

export default function Options(data, displayType) {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const filteredData = data.filter((item) => item.country !== "all")[0].data;

  filteredData
    .find((item) => item.stage === "evaluated")
    .programs[0].years.forEach((year) => years.add(year.year));

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
    yAxis: [
      {
        lineWidth: 1,
        lineColor: "#E6E6E6",
        min: 0,
        title: {
          text: "M€",
        },
      },
      {
        min: 0,
        title: {
          text: "",
        },
        lineWidth: 1,
        lineColor: "#E6E6E6",
        left: "75%",
      },
    ],
    tooltip: {
      valueSuffix: " €",
    },
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
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return displayType === "total_fund_eur"
              ? formatToMillions(this.y as number)
              : (this.y as number);
          },
        },
      },
    },
    series: filteredData
      .find((item) => item.stage === "evaluated")
      .programs.map((program) => ({
        name: program.programme_name_fr,
        data: program.years.map((year) => year[displayType]),
        color: rootStyles.getPropertyValue(
          `--program-${normalizeIdForCssColorNames(
            program.programme_code
          )}-color`
        ),
      }))
      .concat(
        filteredData
          .find((item) => item.stage === "successful")
          .programs.map((program) => ({
            xAxis: 1,
            name: program.programme_name_fr,
            data: program.years.map((year) => year[displayType]),
            color: rootStyles.getPropertyValue(
              `--program-${normalizeIdForCssColorNames(
                program.programme_code
              )}-color`
            ),
          }))
      ),
  };
}

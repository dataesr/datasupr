import { formatToMillions } from "../../../../../../utils/format";
import { normalizeIdForCssColorNames } from "../../../../utils";
import type { HighchartsOptions } from "../../../../../../components/chart-wrapper";

export default function Options(data, displayType): HighchartsOptions {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const filteredData = data.filter((item) => item.country !== "all")[0].data;

  filteredData.find((item) => item.stage === "evaluated").destinations[0].years.forEach((year) => years.add(year.year));

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
        width: "48%",
        title: {
          text: "Projets évalués",
        },
      },
      {
        type: "category" as const,
        categories: Array.from(years).map(String),
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
          formatter: function () {
            return displayType === "total_fund_eur" ? formatToMillions(this.y as number) : (this.y as number);
          },
        },
      },
    },
    series: filteredData
      .find((item) => item.stage === "evaluated")
      .destinations.map((destination) => ({
        name: destination.destination_name_fr,
        data: destination.years.map((year) => year[displayType]),
        color: rootStyles.getPropertyValue(`--destination-${normalizeIdForCssColorNames(destination.destination_code)}-color`),
      }))
      .concat(
        filteredData
          .find((item) => item.stage === "successful")
          .destinations.map((destination) => ({
            xAxis: 1,
            name: destination.destination_name_fr,
            data: destination.years.map((year) => year[displayType]),
            color: rootStyles.getPropertyValue(`--destination-${normalizeIdForCssColorNames(destination.destination_code)}-color`),
          }))
      ),
  } as HighchartsOptions;
}

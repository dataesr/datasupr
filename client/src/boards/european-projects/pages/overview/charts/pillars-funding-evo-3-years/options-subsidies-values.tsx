import { formatToMillions } from "../../../../../../utils/format";

export default function Options(data) {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const filteredData = data.filter((item) => item.country !== "all")[0].data;
  filteredData.forEach((item) => years.add(item.year));

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
        categories: ["2021", "2022", "2023"],
        width: "48%",
        title: {
          text: "Projets évalués",
        },
      },
      {
        type: "category",
        categories: ["2021", "2022", "2023"],
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
          lineColor: null,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return formatToMillions(this.y as number);
          },
        },
      },
    },
    series: filteredData
      .find((item) => item.stage === "evaluated")
      .pillars.map((pillar) => ({
        name: pillar.pilier_name_fr,
        data: pillar.years.map((year) => year.total_fund_eur),
        color: rootStyles.getPropertyValue(
          `--pillar-${pillar.pilier_code}-color`
        ),
      }))
      .concat(
        filteredData
          .find((item) => item.stage === "successful")
          .pillars.map((pillar) => ({
            xAxis: 1,
            name: pillar.pilier_name_fr,
            data: pillar.years.map((year) => year.total_fund_eur),
            color: rootStyles.getPropertyValue(
              `--pillar-${pillar.pilier_code}-color`
            ),
          }))
      ),
  };
}

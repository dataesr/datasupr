import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-ep";
// import { formatToPercentage } from "../../../../../../utils/format";
import type { HighchartsOptions } from "../../../../../../components/chart-wrapper";

export default function Options(data, displayType): HighchartsOptions {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const filteredData = data.filter((item) => item.country !== "all")[0].data;
  const allData = data.find((item) => item.country === "all").data;

  filteredData.find((item) => item.stage === "evaluated").pillars[0].years.forEach((year) => years.add(year.year));

  const newOptions: HighchartsInstance.Options = {
    // chart: {
    //   type: "line",
    //   height: 500,
    //   backgroundColor: "transparent",
    // },
    title: { text: "" },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
    },
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
            return `${Number(this.y).toFixed(1)}%`;
          },
        },
      },
    },
    series: filteredData
      .find((item) => item.stage === "evaluated")
      .pillars.map((pillar) => {
        const allPillarData = allData.find((item) => item.stage === "evaluated").pillars.find((p) => p.pilier_code === pillar.pilier_code);

        return {
          name: pillar.pilier_name_fr,
          data: pillar.years.map((year, index) => {
            const totalForYear = allPillarData.years[index][displayType];
            return totalForYear > 0 ? (year[displayType] / totalForYear) * 100 : 0;
          }),
          color: rootStyles.getPropertyValue(`--pillar-${pillar.pilier_code}-color`),
        };
      })
      .concat(
        filteredData
          .find((item) => item.stage === "successful")
          .pillars.map((pillar) => {
            const allPillarData = allData.find((item) => item.stage === "successful").pillars.find((p) => p.pilier_code === pillar.pilier_code);

            return {
              xAxis: 1,
              name: pillar.pilier_name_fr,
              data: pillar.years.map((year, index) => {
                const totalForYear = allPillarData.years[index][displayType];
                return totalForYear > 0 ? (year[displayType] / totalForYear) * 100 : 0;
              }),
              color: rootStyles.getPropertyValue(`--pillar-${pillar.pilier_code}-color`),
            };
          })
      ),
  };
  return CreateChartOptions("line", newOptions);
}

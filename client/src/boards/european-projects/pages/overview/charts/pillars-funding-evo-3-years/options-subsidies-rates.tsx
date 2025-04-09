// import { formatToPercentage } from "../../../../../../utils/format";

export default function Options(data) {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const filteredData = data.filter((item) => item.country !== "all")[0].data;
  const allData = data.find((item) => item.country === "all").data;

  filteredData.forEach((item) => years.add(item.year));

  return {
    chart: {
      type: "line",
      height: 500,
      backgroundColor: "transparent",
    },
    title: {
      text: "Evolution du taux de succès des financements demandés et obtenus",
    },
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
        max: 100,
        title: {
          text: "%",
        },
      },
      {
        min: 0,
        max: 100,
        title: {
          text: "",
        },
        lineWidth: 1,
        lineColor: "#E6E6E6",
        left: "75%",
      },
    ],
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
      .pillars.map((pillar) => {
        const allPillarData = allData
          .find((item) => item.stage === "evaluated")
          .pillars.find((p) => p.pilier_code === pillar.pilier_code);

        return {
          name: pillar.pilier_name_fr,
          data: pillar.years.map((year, index) => {
            const totalForYear = allPillarData.years[index].total_fund_eur;
            return totalForYear > 0
              ? (year.total_fund_eur / totalForYear) * 100
              : 0;
          }),
          color: rootStyles.getPropertyValue(
            `--pillar-${pillar.pilier_code}-color`
          ),
        };
      })
      .concat(
        filteredData
          .find((item) => item.stage === "successful")
          .pillars.map((pillar) => {
            const allPillarData = allData
              .find((item) => item.stage === "successful")
              .pillars.find((p) => p.pilier_code === pillar.pilier_code);

            return {
              xAxis: 1,
              name: pillar.pilier_name_fr,
              data: pillar.years.map((year, index) => {
                const totalForYear = allPillarData.years[index].total_fund_eur;
                return totalForYear > 0
                  ? (year.total_fund_eur / totalForYear) * 100
                  : 0;
              }),
              color: rootStyles.getPropertyValue(
                `--pillar-${pillar.pilier_code}-color`
              ),
            };
          })
      ),
  };
}

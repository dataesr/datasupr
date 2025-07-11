export default function Options(data, displayType) {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const years = new Set();

  const countryData = data.filter((item) => item.country !== "all")[0].data;

  countryData
    .find((item) => item.stage === "evaluated")
    .pillars[0].years.forEach((year) => years.add(year.year));

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
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return `${Number(this.y).toFixed(1)}%`;
          },
        },
      },
    },
    series: countryData
      .find((item) => item.stage === "evaluated")
      .pillars.map((pillar) => {
        const successfulPillarData = countryData
          .find((item) => item.stage === "successful")
          .pillars.find((p) => p.pilier_code === pillar.pilier_code);

        return {
          name: pillar.pilier_name_fr,
          data: pillar.years.map((year, index) => {
            const evaluatedAmount = year[displayType];
            const successfulAmount =
              successfulPillarData.years[index][displayType];
            return evaluatedAmount > 0
              ? (successfulAmount / evaluatedAmount) * 100
              : 0;
          }),
          color: rootStyles.getPropertyValue(
            `--pillar-${pillar.pilier_code}-color`
          ),
        };
      }),
  };
}

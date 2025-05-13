export default function Options(data) {
  if (!data) return null;

  const filteredData = data.country.filter(
    (el) => el.total_evaluated && el.total_successful
  );

  return {
    chart: {
      type: "column",
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      categories: filteredData.map((item) => item.name),
      crosshair: true,
      accessibility: {
        description: "Actions",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "%",
      },
    },
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        return (this.x ?? "") + " : " + (this.y as number).toFixed(1) + " %";
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Projets évalués",
        data: filteredData.map(
          (item) =>
            (item.total_evaluated /
              data.all.find((el) => el.id === item.id).total_evaluated) *
            100
        ),
        color: "#009099",
      },
      {
        name: "Projets lauréats",
        data: filteredData.map(
          (item) =>
            (item.total_successful /
              data.all.find((el) => el.id === item.id).total_successful) *
            100
        ),
        color: "#233E41",
      },
    ],
  };
}

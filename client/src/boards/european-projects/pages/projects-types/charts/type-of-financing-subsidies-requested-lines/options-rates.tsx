export default function Options(data) {
  if (!data) return null;

  const filteredDataCountry = data.filter((item) => item.country !== "all")[0].data;
  const filteredDataAll = data.filter((item) => item.country === "all")[0].data;

  const years = new Set();
  filteredDataCountry.forEach((item) => years.add(item.year));

  // Obtenir les action_ids uniques
  const actionIds = [...new Set(filteredDataCountry.map((item) => item.action_id))];

  const series = actionIds.map((actionId) => ({
    name: actionId,
    data: filteredDataCountry
      .filter((item) => item.action_id === actionId)
      .map(
        (item) =>
          (item.total_evaluated * 100) /
          filteredDataAll.find((itemAll) => itemAll.year === item.year && itemAll.action_id === actionId).total_evaluated
      ),
    color: `var(--project-type-${(actionId as string).toLowerCase()}-color)`,
  }));

  const series2 = actionIds.map((actionId) => ({
    name: actionId,
    xAxis: 1,
    data: filteredDataCountry
      .filter((item) => item.action_id === actionId)
      .map(
        (item) =>
          (item.total_successful * 100) /
          filteredDataAll.find((itemAll) => itemAll.year === item.year && itemAll.action_id === actionId).total_successful
      ),
    color: `var(--project-type-${(actionId as string).toLowerCase()}-color)`,
  }));

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
          text: "%",
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
      valueSuffix: " %",
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 3,
          // fillColor: "#FFFFFF",
          lineWidth: 2,
          lineColor: null,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return (this.y as number).toFixed(1) + " %";
          },
        },
      },
    },
    series: series.concat(series2),
  };
}

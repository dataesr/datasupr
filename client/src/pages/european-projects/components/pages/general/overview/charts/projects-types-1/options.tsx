export default function Options(data) {
  if (!data) return null;

  const filteredData = data.filter((el) => el.total_evaluated && el.total_successful);

  return {
    chart: {
      type: "column",
      height: 500,
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      categories: filteredData.map((item) => item.id),
      crosshair: true,
      accessibility: {
        description: 'Actions'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '(M€)'
      }
    },
    tooltip: {
      valueSuffix: ' (M€)'
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: 'Projets évalués',
        data: filteredData.map((item) => item.total_evaluated / 1000000),
        color: "#009099"
      },
      {
        name: 'Projets lauréats',
        data: filteredData.map((item) => item.total_successful / 1000000),
        color: "#233E41"
      },
    ]
  };
}
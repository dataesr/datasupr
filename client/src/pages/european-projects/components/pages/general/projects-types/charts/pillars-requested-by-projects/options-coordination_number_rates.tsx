export default function OptionsCoordinationNumberRates(data) {
  if (!data) return null;

  const filteredData = data.country.filter(
    (el) =>
      el.total_coordination_number_evaluated &&
      el.total_coordination_number_successful
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
      categories: filteredData.map((item) => item.id),
      crosshair: true,
      accessibility: {
        description: "Actions",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre de coordinations",
      },
    },
    tooltip: {
      pointFormat: "Nombre de coordinations : <b>{point.y}</b>",
      valueSuffix: "",
    },
    // plotOptions: {
    //   series: { dataLabels: { enabled: true } },
    // },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        borderWidth: 0,
      },
    },
    series: [
      {
        colors: "#009099",
        data: filteredData.map(
          (item) =>
            (item.total_coordination_number_evaluated /
              data.all.find((el) => el.id === item.id)
                .total_coordination_number_evaluated) *
            100
        ),
        name: "Coordination de projets déposés",
      },
      {
        colors: "#233E41",
        data: filteredData.map(
          (item) =>
            (item.total_coordination_number_successful /
              data.all.find((el) => el.id === item.id)
                .total_coordination_number_successful) *
            100
        ),
        name: "Coordination de projets lauéats",
      },
    ],
  };
}

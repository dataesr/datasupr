export default function OptionsCoordinationNumber(data) {
  if (!data) return null;

  return {
    chart: {
      type: "bar",
      height: 400,
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      type: 'category',
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Euros € (millions)'
      }
    },
    tooltip: {
      pointFormat: 'Nombre de coordinations : <b>{point.y}</b>'
    },
    plotOptions: {
      series: { dataLabels: { enabled: true } }
    },
    series: [
      {
        name: 'Coordination de projets déposés',
        colors: ['#009099'],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item.name,
          y: item.total_coordination_number_evaluated,
          rank_coordination_number_evaluated: item.rank_coordination_number_evaluated,
        })),
        dataLabels: [{
          align: 'right',
          format: '{point.rank_coordination_number_evaluated}e'
        }],
      },
      {
        name: 'Coordination de projets lauéats',
        colors: ['#233E41'],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item.name,
          y: item.total_coordination_number_successful,
          rank_coordination_number_successful: item.rank_coordination_number_successful,
        })),
        dataLabels: [{
          align: 'right',
          format: '{point.rank_coordination_number_successful}e'
        }],
      }
    ]
  };
}
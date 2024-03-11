export default function Options(data) {
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
      pointFormat: 'Total des subventions : <b>{point.y:.1f} €</b>'
    },
    plotOptions: {
      series: { dataLabels: { enabled: true } }
    },
    series: [
      {
        name: 'Total subventions en euros',
        colors: ['#009099'],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item.name,
          y: item.total_evaluated,
          rank_evaluated: item.rank_evaluated,
        })),
        dataLabels: [{
          align: 'right',
          format: '{point.rank_evaluated}e'
        }],
      },
      {
        name: 'Total subventions en euros',
        colors: ['#233E41'],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item.name,
          y: item.total_successful,
          rank_successful: item.rank_successful,
        })),
        dataLabels: [{
          align: 'right',
          format: '{point.rank_successful}e'
        }],
      }
    ]
  };
}
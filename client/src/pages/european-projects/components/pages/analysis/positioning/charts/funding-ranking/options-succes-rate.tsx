export default function optionSuccessRate(data) {
  if (!data) return null;

  // average ratio
  const total = data.reduce((acc, el) => acc + el.ratio, 0);
  const average = total / data.length;

  return {
    chart: {
      type: "bar",
      height: 400,
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      visible: false,
    },
    yAxis: {
      plotLines: [{
        color: '#D75521',
        width: 4,
        value: average,
        zIndex: 4,
        dashStyle: 'dot',
      }],
      min: 0,
      title: {
        text: 'Taux de succès %'
      },
    },
    tooltip: {
      pointFormat: 'Total des subventions : <b>{point.y:.1f} €</b>'
    },
    plotOptions: {
      series: { dataLabels: { enabled: true } }
    },
    series: [
      {
        name: 'Succès sur les montants',
        colors: ['#27A658'],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item.name,
          y: item.ratio,
        })),
        dataLabels: [{
          align: 'right',
          format: '{point.name}'
        }],
      }
    ]
  };
}
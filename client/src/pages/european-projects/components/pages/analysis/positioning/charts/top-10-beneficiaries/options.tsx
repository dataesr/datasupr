export default function Options(data) {
  if (!data) return null;

  return {
    chart: {
      height: 500,
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
    yAxis: [
      {
        title: {
          text: 'Total subventions en euros €'
        }
      },
      {
        title: {
          text: 'Poids du cumul des subventions (%)'
        },
        opposite: true
      }
    ],
    series: [{
      name: 'Total subventions en euros',
      type: "column",
      colors: ['#233E41'],
      colorByPoint: true,
      data: data.top10.map((item) => [item.name_fr, item.total_fund_eur]),
      tooltip: {
        pointFormat: 'Total des subventions : <b>{point.y:.1f} €</b>'
      },
    }, {
      name: 'Poids du cumul des subventions',
      type: "spline",
      color: '#D75521',
      data: data.top10.map((item) => [item.name_fr, item.influence]),
      tooltip: {
        pointFormat: 'Poids du cumul des subventions : <b>{point.y:.1f} %</b>'
      },
      yAxis: 1,
      lineWidth: 0,
    }
    ]
  };
}
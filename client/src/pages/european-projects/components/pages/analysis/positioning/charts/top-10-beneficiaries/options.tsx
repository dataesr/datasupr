export default function Options(data, country_code) {
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
      colorByPoint: true,
      data: data.top10.map((item) => {
        return {
          name: item.name_fr,
          y: item.total_fund_eur,
          color: (item.id == country_code) ? '#6E445A' : '#233E41'
        }
      }),
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
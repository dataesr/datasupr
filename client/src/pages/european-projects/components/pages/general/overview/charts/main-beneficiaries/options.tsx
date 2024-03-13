export default function Options(data) {
  if (!data) return null;

  return {
    chart: {
      type: "bar",
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
    yAxis: {
      min: 0,
      title: {
        text: 'Euros € (millions)'
      }
    },
    tooltip: {
      pointFormat: 'Total des subventions : <b>{point.y:.1f} €</b>'
    },
    series: [{
      name: 'Total subventions en euros',
      colors: ['#1E3859'],
      colorByPoint: true,
      groupPadding: 0,
      data: data.list.map((item) => [item.acronym, item.total_fund_eur]),
    }]
  };
}
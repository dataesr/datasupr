import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type HistoData = {
  annee_universitaire: string;
  effectif_pr: number;
  effectif_pu: number;
};

export default function SectorStackedChart({ data = [], isLoading = true }: { data: HistoData[], isLoading: boolean }) {
  if (isLoading || !data || !data.length) {
    return (
      <div>Loader</div>
    );
  }

  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: data.map((item) => item.annee_universitaire)
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Count trophies'
      },
      stackLabels: {
        enabled: true
      }
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false
        }
      }
    },
    credit: {
      enabled: false
    },
    series: [{
      name: 'Secteur privé',
      data: data.map((item) => item.effectif_pr),
      color: '#755F4D'
    }, {
      name: 'Secteur public',
      data: data.map((item) => item.effectif_pu),
      color: '#748CC0'
    }]
  }

  return (
    <section>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </section>
  );
}
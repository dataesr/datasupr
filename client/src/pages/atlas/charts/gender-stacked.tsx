import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type HistoData = {
  annee_universitaire: string;
  effectif_feminin: number;
  effectif_masculin: number;
};

export default function GenderStackedChart({ data = [], isLoading = true }: { data: HistoData[], isLoading: boolean }) {
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
      text: 'Historique de la répartition par genre des étudiants inscrits depuis l\'année universitaire 2001-2002',
      align: 'left'
    },
    // accessibility: {
    //   point: {
    //     valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
    //   }
    // },
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
      name: 'Féminin',
      data: data.map((item) => item.effectif_feminin),
      color: '#e18b76'
    }, {
      name: 'Masculin',
      data: data.map((item) => item.effectif_masculin),
      color: '#efcb3a'
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
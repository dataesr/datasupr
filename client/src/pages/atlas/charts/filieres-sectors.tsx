import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Template from "../../../components/template";

type DataProps = {
  label: string;
  effectif_PU: number;
  effectif_PR: number;
};

export default function FilieresSectorsChart({ data, isLoading }: { data: DataProps[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <Template />
    );
  }
  const filieresOptions = {
    chart: {
      type: 'bar',
      height: '600'
    },
    title: {
      text: "Nombre d'étudiants inscrits par fillière répartis par secteur",
      align: 'left'
    },
    subtitle: {
      text: 'Source: <a ' +
        'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
        'target="_blank">Source</a>',
      align: 'left'
    },
    xAxis: {
      categories: data.map((filiere) => filiere.label),
      title: {
        text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'étudiants",
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    },
    tooltip: {
      valueSuffix: ' étudiants'
    },
    plotOptions: {
      bar: {
        borderRadius: '50%',
        dataLabels: {
          enabled: true
        },
        groupPadding: 0.1
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Secteur public',
      data: data.map((filiere) => (filiere.effectif_PU) ? filiere.effectif_PU : 0),
      color: '#748CC0'
    }, {
      name: 'Secteur privé',
      data: data.map((filiere) => (filiere.effectif_PR) ? filiere.effectif_PR : 0),
      color: '#755F4D'
    }]
  };
  return (
    <section>
      <HighchartsReact
        highcharts={Highcharts}
        options={filieresOptions}
      />
    </section>
  )
}
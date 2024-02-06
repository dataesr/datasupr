import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type DataByYear = {
  annee_universitaire: string,
  effectif: number,
}

export default function AeraChart({ data }: { data: DataByYear[] }) {
  const filieresOptions = {
    chart: {
      type: 'area',
      height: '250'
    },
    title: {
      text: "Données historiques",
      align: 'left',
      style: {
        fontSize: '1rem',
      }
    },
    subtitle: {
      text: 'Nombre d\'étudiants inscrits par année universitaire depuis l\'année 2001-2002',
      align: 'left'
    },
    xAxis: {
      categories: data.map((year) => year.annee_universitaire),
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
    credits: {
      enabled: false
    },
    series: [{
      name: "Nombre d'étudiants inscrits",
      data: data.map((year) => ({
        y: year.effectif,
      }))
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
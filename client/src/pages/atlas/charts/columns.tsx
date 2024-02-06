import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { DataByYear } from '../../../types/atlas';

export default function ColumnsChart({ data, label, currentYear, noTitle }: { data: DataByYear[], label: string, currentYear: string, noTitle: boolean }) {
  const filieresOptions = {
    chart: {
      type: 'column',
      height: '250'
    },
    title: {
      text: ""
    },
    subtitle: {
      text: 'Nombre d\'étudiants inscrits par année universitaire',
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
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
      name: "Nombre d'étudiants inscrits",
      data: data.map((year) => ({
        y: (year[label]) ? year[label] : 0,
        color: (year.annee_universitaire === currentYear) ? '#ce614a' : '#999'
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
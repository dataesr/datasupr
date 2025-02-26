import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { DataByYear } from '../../../types/atlas';

export default function ColumnsChart({ data, label, currentYear }: { data: DataByYear[], label: string, currentYear: string }) {
  const rootStyles = getComputedStyle(document.documentElement);
  const filieresOptions = {
    chart: {
      backgroundColor: "transparent",
      height: '250',
      type: 'column',
    },
    title: {
      text: ""
    },
    subtitle: {
      align: 'left',
      style: {
        color: rootStyles.getPropertyValue("--label-color"),
        fontFamily: "Marianne, sans-serif",
      },
      text: 'Nombre d\'étudiants inscrits par année universitaire'
    },
    xAxis: {
      categories: data.map((year) => year.annee_universitaire),
      gridLineWidth: 1,
      labels: {
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
      },
      lineWidth: 0,
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        align: 'high',
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
        text: "Nombre d'étudiants"
      },
      labels: {
        overflow: 'justify',
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
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
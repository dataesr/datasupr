import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type GenderData = {
  name: string;
  y: number;
}[];

export default function GenderChart({ data = [], isLoading, currentYear }: { data: GenderData, isLoading: boolean, currentYear: string }) {
  if (isLoading || !data || !data.length) {
    return (
      <div>Loader</div>
    );
  }
  const secteursOptions = {
    chart: {
      type: 'pie'
    },
    title: {
      text: "Pourcentage d'étudiants inscrits regroupés par genre pour l'année universitaire " + currentYear,
      align: 'left'
    },
    credits: {
      enabled: false
    },
    // tooltip: {
    //   valueSuffix: ' étudiants'
    // },
    // subtitle: {
    //   text:
    //     'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>',
    //   align: 'left'
    // },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [{
          enabled: true,
          distance: 20
        }, {
          enabled: true,
          distance: -40,
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '1.2em',
            textOutline: 'none',
            opacity: 0.7
          },
          filter: {
            operator: '>',
            property: 'percentage',
            value: 10
          }
        }]
      },
      pie: {
        colors: ['#efcb3a', '#e18b76'],
      }
    },
    series: [
      {
        name: 'Nombre d\'étudiants',
        colorByPoint: true,
        data
      }
    ]
  }

  return (
    <section>
      <HighchartsReact
        highcharts={Highcharts}
        options={secteursOptions}
      />
    </section>
  );
}
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type valuesProps = {
  labels: string[],
  values: number[],
};

type CardProps = {
  currentYear: string,
  values: valuesProps,
};

import "./style.scss";

export default function GendersCard({ currentYear, values }: CardProps) {
  const secteursOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '60%',
    },
    title: {
      text: 'Genres',
      align: 'center',
      verticalAlign: 'middle',
      y: 60
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
        size: '110%'
      }
    },
    credits: {
      enabled: false
    },
    colors: ['#efcb3a', '#e18b76'],
    series: [{
      type: 'pie',
      name: currentYear,
      innerSize: '50%',
      data: values.labels.map((label, index) => [label, values.values[index]])
    }]
  }

  return (
    <figure>
      <HighchartsReact
        highcharts={Highcharts}
        options={secteursOptions}
      />
    </figure>
  );
}
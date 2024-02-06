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

export default function SectorsCard({ currentYear, values }: CardProps) {
  const secteursOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '60%',
    },
    title: {
      text: 'Secteurs',
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
    colors: ['#748CC0', '#755F4D'],
    series: [{
      type: 'pie',
      name: currentYear,
      innerSize: '50%',
      data: values.labels.map((label, index) => [label, values.values[index]])
    }]
  }

  return (
    <figure style={{ height: '200px' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={secteursOptions}
      />
    </figure>
  );
}
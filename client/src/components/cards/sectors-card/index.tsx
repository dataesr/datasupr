import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type valuesProps = {
  labels: string[];
  values: number[];
};

type CardProps = {
  currentYear: string;
  values: valuesProps;
};

import "./style.scss";

export default function SectorsCard({ currentYear, values }: CardProps) {
  const secteursOptions = {
    chart: {
      backgroundColor: "transparent",
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: "60%",
    },
    title: {
      text: "Secteurs",
      align: "center",
      verticalAlign: "middle",
      y: 60,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: { enabled: false },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "75%"],
        size: "150%",
      },
    },
    credits: {
      enabled: false,
    },
    colors: ["#748CC0", "#755F4D"],
    series: [
      {
        type: "pie",
        name: currentYear,
        innerSize: "10%",
        data: values.labels.map((label, index) => [
          label,
          values.values[index],
        ]),
        showInLegend: true,
      },
    ],
  };

  return (
    <figure style={{ height: "200px" }}>
      <HighchartsReact highcharts={Highcharts} options={secteursOptions} />
    </figure>
  );
}

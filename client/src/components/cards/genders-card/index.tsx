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

import "./styles.scss";


export default function GendersCard({ currentYear, values }: CardProps) {
  const rootStyles = getComputedStyle(document.documentElement);
  const secteursOptions = {
    chart: {
      backgroundColor: "transparent",
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: "60%",
    },
    title: {
      text: "Genres",
      align: "center",
      verticalAlign: "middle",
      y: 60,
      style: {
        color: rootStyles.getPropertyValue("--label-color"),
        fontSize: "16px",
        fontFamily: "Marianne, sans-serif",
      },
    },
    legend: {
      itemStyle:{
        color: rootStyles.getPropertyValue("--label-color"),
        fontFamily: "Marianne, sans-serif",
      }
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
    colors: ["#efcb3a", "#e18b76"],
    series: [
      {
        type: "pie",
        name: currentYear,
        innerSize: "92%",
        data: values.labels.map((label, index) => [
          label,
          values.values[index],
        ]),
        showInLegend: true,
      },
    ],
  };

  return (
    <figure>
      <HighchartsReact highcharts={Highcharts} options={secteursOptions} />
    </figure>
  );
}

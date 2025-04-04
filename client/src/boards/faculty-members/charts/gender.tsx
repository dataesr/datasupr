import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface GenderPieChartProps {
  maleCount: number;
  femaleCount: number;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({
  maleCount,
  femaleCount,
}) => {
  const chartOptions = {
    chart: {
      type: "pie",
      height: "80%",
      spacingTop: 0,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
        borderWidth: 0,
        innerSize: "60%",
      },
    },
    series: [
      {
        name: "Sexe",
        data: [
          { name: "Hommes", y: maleCount },
          { name: "Femmes", y: femaleCount },
        ],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default GenderPieChart;

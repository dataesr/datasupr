import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface FieldsPieChartProps {
  MainFields: { [key: string]: number };
}

const CNUPieChart: React.FC<FieldsPieChartProps> = ({ MainFields }) => {
  const chartOptions = {
    chart: {
      type: "pie",
      height: "100%",
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
        innerSize: "50%",
      },
    },
    series: [
      {
        name: "Grande Discipline",
        data: Object.entries(MainFields).map(([name, y]) => ({
          name,
          y,
        })),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default CNUPieChart;

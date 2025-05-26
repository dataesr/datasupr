import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";

interface OptionsProps {
  maleCount: number | undefined;
  femaleCount: number | undefined;
}

export default function Options({
  maleCount,
  femaleCount,
}: OptionsProps): HighchartsInstance.Options | null {
  if (!maleCount || !femaleCount) return null;

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "pie",
      height: "40%",
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
        innerSize: "10%",
      },
    },
    series: [
      {
        type: "pie",
        name: "Sexe",
        data: [
          { name: "Hommes", y: maleCount },
          { name: "Femmes", y: femaleCount },
        ],
      },
    ],
  };

  return CreateChartOptions("pie", newOptions);
}

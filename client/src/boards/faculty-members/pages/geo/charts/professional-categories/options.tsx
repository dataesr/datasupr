import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";

interface OptionsProps {
  categories: {
    id: string;
    label_fr: string;
    headcount: number;
  }[];
}

export default function Options({
  categories,
}: OptionsProps): HighchartsInstance.Options | null {
  if (!categories || categories.length === 0) {
    return null;
  }
  const rootStyles = getComputedStyle(document.documentElement);

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: categories.map((cat) => cat.label_fr),
      title: {
        text: null,
      },
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    tooltip: {
      valueSuffix: " personnes",
      backgroundColor: "#f4f6fe",
      borderColor: "#bfccfb",
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          style: {
            color: "#2f4077",
            textOutline: "none",
          },
        },
        colorByPoint: true,
        borderRadius: 3,
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Effectif",
        type: "column",
        data: categories.map((cat) => ({
          y: cat.headcount,
          color: rootStyles.getPropertyValue(
            "--teaching-staffs-pillar-1-color"
          ),
        })),
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}

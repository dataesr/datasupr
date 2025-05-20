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

  const colors = [
    "#3558a2",
    "#2f4077",
    "#6e445a",
    "#8d533e",
    "#a94645",
    "#efcb3a",
    "#006a6f",
  ];

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "column",
      backgroundColor: "#f9f6f2",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: categories.map((cat) => cat.label_fr),
      title: {
        text: null,
      },
      labels: {
        style: {
          color: "#2f4077",
        },
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
      style: {
        color: "#2f4077",
      },
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
        colors: colors,
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
          color: colors[categories.indexOf(cat) % colors.length],
        })),
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}

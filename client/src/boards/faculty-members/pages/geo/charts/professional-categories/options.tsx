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

  const getCategoryColor = (index: number): string => {
    const colorVariables = [
      "--teaching-staffs-pillar-1-color",
      "--teaching-staffs-pillar-2-color",
      "--teaching-staffs-pillar-3-color",
      "--teaching-staffs-pillar-4-color",
      "--teaching-staffs-pillar-5-color",
    ];

    const colorVar = colorVariables[index % colorVariables.length];

    return rootStyles.getPropertyValue(colorVar);
  };

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
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
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
        data: categories.map((cat, index) => ({
          y: cat.headcount,
          name: cat.label_fr,
          color: getCategoryColor(index),
        })),
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}

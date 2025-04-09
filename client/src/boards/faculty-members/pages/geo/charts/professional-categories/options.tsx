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

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "column",
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
      min: 0,
      title: {
        text: "Effectif", // Suppression de "values" ici
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      valueSuffix: " personnes",
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
        },
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
        data: categories.map((cat) => cat.headcount),
      },
    ],
  };

  return CreateChartOptions("column", newOptions);
}

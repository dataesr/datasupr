import Highcharts from "highcharts";
import { CreateChartOptions } from "../../../../components/creat-chart-options";

export interface CategoryData {
  categoryCode: string;
  categoryName: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

export const createCategoryOptions = (
  categoryData: CategoryData[]
): Highcharts.Options | null => {
  if (!categoryData || categoryData.length === 0) return null;

  const sortedData = [...categoryData].sort(
    (a, b) => b.totalCount - a.totalCount
  );

  const categories = sortedData.map((item) => item.categoryName);
  const counts = sortedData.map((item) => item.totalCount);

  const total = counts.reduce((acc, curr) => acc + curr, 0);
  const percentages = counts.map((count) => Math.round((count / total) * 100));

  const newOptions: Highcharts.Options = {
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      height: Math.max(250, 80 + categories.length * 40),
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: "",
    },
    xAxis: {
      categories,
      title: { text: null },
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: "500",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'enseignants",
        style: {
          fontSize: "11px",
        },
      },
      labels: {
        style: {
          fontSize: "10px",
        },
        overflow: "justify",
      },
    },
    tooltip: {
      formatter: function () {
        const index = this.point.index;
        return `<b>${categories[index]}</b>: ${
          this.y?.toLocaleString() || 0
        } enseignants-chercheurs (${percentages[index]}&nbsp;%)`;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: "{y:,.0f}",
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            textOutline: "1px contrast",
          },
        },
        colorByPoint: true,
        colors: sortedData.map((_, i) =>
          i === 0
            ? "var(--blue-cumulus-main-526)"
            : "var(--green-archipel-main-557)"
        ),
      },
    },
    credits: { enabled: false },
    legend: { enabled: false },
    series: [
      {
        name: "Effectif",
        data: counts,
        type: "bar",
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
};

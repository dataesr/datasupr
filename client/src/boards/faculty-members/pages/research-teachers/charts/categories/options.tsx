import Highcharts from "highcharts";

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
  const womenData = sortedData.map((item) => item.femaleCount);
  const menData = sortedData.map((item) => item.maleCount);

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
          color: "var(--text-default-grey)",
        },
      },
    },
    exporting: {
      enabled: false,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'enseignants",
        style: {
          fontSize: "11px",
          color: "var(--text-default-grey)",
        },
      },
      labels: {
        style: {
          fontSize: "10px",
          color: "var(--text-default-grey)",
        },
        overflow: "justify",
      },
      stackLabels: {
        enabled: true,
        format: "{total:,.0f}",
        style: {
          fontSize: "10px",
          fontWeight: "bold",
          color: "var(--text-inverted-grey)",
          textOutline: "none",
        },
      },
    },
    tooltip: {
      shared: true,
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat:
        '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y:,.0f}<br/>',
      footerFormat: "Total: {point.total:,.0f}",
    },
    plotOptions: {
      bar: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
      },
    },
    credits: { enabled: false },
    legend: {
      enabled: true,
      reversed: true,
      itemStyle: {
        fontSize: "11px",
        color: "var(--text-default-grey)",
      },
    },
    series: [
      {
        name: "Hommes",
        data: menData,
        type: "bar",
        color: "var(--men-color)",
      },
      {
        name: "Femmes",
        data: womenData,
        type: "bar",
        color: "var(--women-color)",
      },
    ],
  };

  return newOptions;
};

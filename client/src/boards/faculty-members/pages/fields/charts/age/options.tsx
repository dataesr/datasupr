import { CreateChartOptions } from "../../../../components/chart-faculty-members";

interface ChartDataItem {
  name: string;
  y: number;
  count: number;
}

export const createAgeDistributionChartOptions = (
  chartData: ChartDataItem[],
  chartTitle: string,
  year: string
) => {
  const sortOrder = {
    "35 ans et moins": 1,
    "36 à 55 ans": 2,
    "56 ans et plus": 3,
  };

  const sortedChartData = [...chartData].sort(
    (a, b) => sortOrder[a.name] - sortOrder[b.name]
  );

  const colors = {
    "35 ans et moins": "#6EADFF",
    "36 à 55 ans": "#000091",
    "56 ans et plus": "#4B9DFF",
  };

  return CreateChartOptions("bar", {
    chart: {
      type: "bar",
      height: 350,
    },
    title: {
      text: chartTitle,
    },
    subtitle: {
      text: `Année académique ${year}`,
    },
    xAxis: {
      categories: sortedChartData.map((item) => item.name),
      title: {
        text: null,
      },
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Pourcentage",
        align: "high",
      },
      labels: {
        format: "{value}%",
        overflow: "justify",
      },
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br>${this.y?.toFixed(1) ?? 0}% (${
          sortedChartData.find((d) => d.name === this.x)?.count
        } enseignants)`;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: "{y:.1f}%",
        },
        colorByPoint: true,
        colors: sortedChartData.map((item) => colors[item.name]),
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
        name: "Âge",
        data: sortedChartData.map((item) => item.y),
        type: "bar",
      },
    ],
  });
};

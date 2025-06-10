import { CreateChartOptions } from "../../components/chart-faculty-members";
import Highcharts from "highcharts";

interface ChartDataItem {
  name: string;
  y: number;
  count: number;
}

export const createAgeDistributionChartOptions = (
  chartData: ChartDataItem[],
  chartTitle: string,
  year: string,
  isSingleDiscipline: boolean = false
): Highcharts.Options | null => {
  if (!chartData || chartData.length === 0) return null;

  const sortOrder: { [key: string]: number } = {
    "35 ans et moins": 1,
    "36 à 55 ans": 2,
    "56 ans et plus": 3,
  };

  const sortedChartData = [...chartData].sort(
    (a, b) => (sortOrder[a.name] || 99) - (sortOrder[b.name] || 99)
  );

  const colors: { [key: string]: string } = {
    "35 ans et moins": "#6EADFF",
    "36 à 55 ans": "#000091",
    "56 ans et plus": "#4B9DFF",
  };

  if (isSingleDiscipline) {
    const newOptions: Highcharts.Options = {
      chart: {
        type: "pie",
        height: 400,
      },
      title: {
        text: chartTitle,
        style: { fontSize: "16px", fontWeight: "bold" },
      },
      subtitle: {
        text: `Année universitaire ${year}`,
        style: { fontSize: "14px", color: "#666" },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f}%",
            style: {
              textOutline: "1px contrast",
            },
          },
          showInLegend: true,
          size: "75%",
          borderWidth: 3,
          borderColor: "#FFFFFF",
        },
        series: {
          animation: {
            duration: 800,
          },
        },
      },
      tooltip: {
        pointFormat:
          "{point.name}: <b>{point.count} enseignants</b> ({point.percentage:.1f}%)",
      },
      legend: {
        enabled: true,
        layout: "horizontal",
        align: "center",
        verticalAlign: "bottom",
        itemStyle: {
          fontWeight: "normal",
        },
      },
      series: [
        {
          name: "Répartition par âge",
          colorByPoint: true,
          type: "pie",
          data: sortedChartData.map((item) => ({
            name: item.name,
            y: item.y,
            count: item.count,
            color: colors[item.name] || "#CCCCCC",
            dataLabels: {
              format: `<b>${item.name}</b>: {point.percentage:.1f}%<br/>({point.count} pers.)`,
            },
          })),
        } as Highcharts.SeriesPieOptions,
      ],
      credits: { enabled: false },
    };

    return CreateChartOptions("pie", newOptions);
  }

  const newOptions: Highcharts.Options = {
    chart: {
      type: "bar",
      height: 350,
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: chartTitle,
      style: { fontSize: "18px", fontWeight: "bold" },
      align: "left",
    },
    subtitle: {
      text: `Année universitaire ${year}`,
      style: {
        color: "#666666",
        fontSize: "14px",
      },
      align: "left",
    },
    xAxis: {
      categories: sortedChartData.map((item) => item.name),
      title: {
        text: null,
      },
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: "600",
        },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Pourcentage",
        align: "high",
        style: {
          fontSize: "14px",
        },
      },
      labels: {
        format: "{value}%",
        overflow: "justify",
      },
      gridLineWidth: 1,
      gridLineColor: "#E0E0E0",
    },
    tooltip: {
      formatter: function () {
        const dataItem = sortedChartData.find((d) => d.name === this.x);
        return `<b>${this.x}</b><br>
                ${this.y?.toFixed(1) ?? 0}% 
                (${dataItem?.count?.toLocaleString() ?? 0} enseignants)`;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: "{y:.1f}%",
          style: {
            color: "white",
            textOutline: "1px contrast",
            fontWeight: "bold",
          },
        },
        colorByPoint: true,
        colors: sortedChartData.map((item) => colors[item.name] || "#CCCCCC"),
        borderRadius: 3,
      },
      series: {
        animation: {
          duration: 1000,
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
        name: "Âge",
        data: sortedChartData.map((item) => ({
          y: item.y,
          color: colors[item.name] || "#CCCCCC",
        })),
        type: "bar",
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
};

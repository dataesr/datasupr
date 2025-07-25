import { CreateChartOptions } from "../../components/creat-chart-options";
import Highcharts from "highcharts";

interface ChartDataItem {
  name: string;
  y: number;
  count: number;
}

export const createAgeDistributionChartOptions = (
  chartData: ChartDataItem[],
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
        text: "",
      },
      exporting: { enabled: false },
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
      type: "pie",
      height: 300,
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    exporting: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: "60%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        borderWidth: 0,
      },
      series: {
        animation: {
          duration: 800,
        },
      },
    },
    tooltip: {
      useHTML: true,
      pointFormatter: function (
        this: Highcharts.PointOptionsObject & {
          count?: number;
          percentage?: number;
        }
      ) {
        const count =
          this.count?.toLocaleString("fr-FR") ??
          this.y?.toLocaleString("fr-FR");
        const percentage = this.percentage as number | undefined;
        return `<b>${this.name}</b>: ${percentage?.toFixed(
          1
        )}% (${count} enseignants)`;
      },
      headerFormat: "",
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemMarginTop: 5,
      itemMarginBottom: 5,
      itemStyle: {
        fontSize: "11px",
        fontWeight: "normal",
      },
    },
    series: [
      {
        name: "Âge",
        colorByPoint: true,
        type: "pie",
        data: sortedChartData.map((item) => ({
          name: item.name,
          y: item.y,
          count: item.count,
          color: colors[item.name] || "#CCCCCC",
        })),
      } as Highcharts.SeriesPieOptions,
    ],
    credits: { enabled: false },
  };

  return CreateChartOptions("pie", newOptions);
};

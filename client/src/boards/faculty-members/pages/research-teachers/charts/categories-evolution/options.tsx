import Highcharts from "highcharts";
import { CreateChartOptions } from "../../../../components/creat-chart-options";
import {
  EvolutionSeriesData,
  EvolutionSeriesDataPoint,
} from "../../../../../../types/faculty-members";

export const createCategoryEvolutionOptions = (
  evolutionByCategories: EvolutionSeriesData[],
  academicYears: string[]
): Highcharts.Options | null => {
  if (
    !evolutionByCategories ||
    evolutionByCategories.length === 0 ||
    !academicYears ||
    academicYears.length === 0
  ) {
    return null;
  }

  const newOptions: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      height: 400,
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: academicYears,
      title: {
        text: "Année universitaire",
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
      },
    },
    yAxis: {
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
      },
    },
    tooltip: {
      shared: true,
      formatter: function () {
        let tooltipHtml = `<b>Année: ${this.x}</b><br/>`;

        this.points?.forEach((point) => {
          const customData = point.options as EvolutionSeriesDataPoint;

          const total = customData.y?.toLocaleString() || 0;
          const male = customData.maleCount?.toLocaleString() || 0;
          const female = customData.femaleCount?.toLocaleString() || 0;

          tooltipHtml += `
            <span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${total}</b><br/>
            &nbsp;&nbsp;&nbsp;♂️ Hommes: ${male}<br/>
            &nbsp;&nbsp;&nbsp;♀️ Femmes: ${female}<br/>
          `;
        });
        return tooltipHtml;
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
        },
        dataLabels: {
          enabled: false,
        },
      },
    },
    credits: { enabled: false },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        fontSize: "11px",
        color: "var(--text-default-grey)",
      },
    },
    series: evolutionByCategories.map(
      (series) =>
        ({
          name: series.name,
          data: series.data,
          type: "line",
        } as Highcharts.SeriesOptionsType)
    ),
  };

  return CreateChartOptions("line", newOptions);
};

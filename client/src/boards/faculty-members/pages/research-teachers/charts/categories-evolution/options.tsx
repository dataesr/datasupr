import Highcharts from "highcharts";
import { CreateChartOptions } from "../../../../components/creat-chart-options";

export interface EvolutionSeriesDataPoint {
  y: number;
  maleCount: number;
  femaleCount: number;
  annee_universitaire: string;
}

export interface EvolutionSeriesData {
  name: string;
  data: EvolutionSeriesDataPoint[];
}

export interface CategoryEvolutionResponse {
  evolutionByCategories: EvolutionSeriesData[];
  academicYears: string[];
}

export const createCategoryEvolutionOptions = (
  evolutionByCategories: EvolutionSeriesData[],
  academicYears: string[],
  titleText: string = "Évolution du nombre d'enseignants par catégorie"
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
      text: titleText,
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "var(--text-title-grey)",
      },
    },
    xAxis: {
      categories: academicYears,
      title: {
        text: "Année universitaire",
        style: {
          fontSize: "11px",
        },
      },
      labels: {
        style: {
          fontSize: "10px",
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
      },
    },
    tooltip: {
      shared: true,
      formatter: function () {
        let tooltipHtml = `<b>Année: ${this.x}</b><br/>`;

        this.points?.forEach((point) => {
          const customData = point.point.options as EvolutionSeriesDataPoint;

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
      series: {},
    },
    credits: { enabled: false },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        fontSize: "11px",
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

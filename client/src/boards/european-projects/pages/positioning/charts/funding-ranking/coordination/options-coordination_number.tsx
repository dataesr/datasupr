import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../../components/chart-ep";

interface DataItem {
  name_fr: string;
  name_en: string;
  total_coordination_number_evaluated: number;
  total_coordination_number_successful: number;
  rank_coordination_number_evaluated: number;
  rank_coordination_number_successful: number;
}

export default function OptionsCoordinationNumber(data: DataItem[], currentLang: string): Highcharts.Options | null {
  if (!data) return null;

  const rootStyles = getComputedStyle(document.documentElement);

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "bar",
      height: 400,
    },
    title: { text: "" },
    legend: { enabled: true, layout: "horizontal" },
    credits: { enabled: false },
    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Euros € (millions)",
      },
    },
    tooltip: {
      pointFormat: "Nombre de coordinations : <b>{point.y}</b>",
    },
    plotOptions: {
      series: { dataLabels: { enabled: true } },
    },
    series: [
      {
        type: "bar",
        name: "Coordination de projets déposés",
        color: rootStyles.getPropertyValue("--evaluated-project-color"),
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}` as keyof DataItem],
          y: item.total_coordination_number_evaluated,
          rank_coordination_number_evaluated: item.rank_coordination_number_evaluated,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.rank_coordination_number_evaluated}e",
          },
        ],
      } as Highcharts.SeriesBarOptions,
      {
        type: "bar",
        name: "Coordination de projets lauréats",
        color: rootStyles.getPropertyValue("--successful-project-color"),
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}` as keyof DataItem],
          y: item.total_coordination_number_successful,
          rank_coordination_number_successful: item.rank_coordination_number_successful,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.rank_coordination_number_successful}e",
          },
        ],
      } as Highcharts.SeriesBarOptions,
    ],
  };
  return CreateChartOptions("bar", newOptions);
}

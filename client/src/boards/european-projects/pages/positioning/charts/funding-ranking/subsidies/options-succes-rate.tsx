import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../../components/chart-ep";

interface DataItem {
  name: string;
  ratio: number;
}

export default function optionSuccessRate(data: DataItem[], currentLang: string): Highcharts.Options | null {
  if (!data) return null;

  const rootStyles = getComputedStyle(document.documentElement);

  // average ratio
  const total = data.reduce((acc, el) => acc + el.ratio, 0);
  const average = total / data.length;

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "bar",
      height: 400,
    },
    title: { text: "" },
    legend: { enabled: true, layout: "horizontal" },
    credits: { enabled: false },
    xAxis: {
      visible: false,
    },
    yAxis: {
      plotLines: [
        {
          color: rootStyles.getPropertyValue("--averageSuccessRate-color"),
          width: 4,
          value: average,
          zIndex: 4,
          dashStyle: "Dot",
        },
      ],
      min: 0,
      title: {
        text: "Taux de succès %",
      },
    },
    tooltip: {
      pointFormat: "Taux de succès : <b>{point.y:.1f} % </b>",
    },
    plotOptions: {
      series: { dataLabels: { enabled: true } },
    },
    series: [
      {
        type: "bar",
        name: "Taux de succès sur les montants",
        color: rootStyles.getPropertyValue("--successRate-color"),
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}`],
          y: item.ratio,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.name}",
          },
        ],
      } as Highcharts.SeriesBarOptions,
    ],
  };
  return CreateChartOptions("bar", newOptions);
}

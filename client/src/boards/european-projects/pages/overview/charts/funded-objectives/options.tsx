import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { getColorByPillierName } from "./utils";

export default function Options(data) {
  if (!data) return null;

  const newOptions: HighchartsInstance.Options = {
    xAxis: {
      categories: data.map((item) => item.programme_name_fr),
      title: { text: "" },
    },
    yAxis: {
      title: { text: "" },
      endOnTick: false,
    },
    series: [
      {
        type: "bar",
        name: "Part captée en %",
        data: data.map((item) => ({
          y: item.total_funding,
          color: getColorByPillierName(item.pilier_name_fr),
        })),
        dataLabels: {
          enabled: false,
        },
        yAxis: 0,
        showInLegend: false,
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
}

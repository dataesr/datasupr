import { getColorByPillierName } from "./utils";

export default function Options(data) {
  return {
    chart: {
      type: "bar",
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: "" },
    xAxis: {
      categories: data.map((item) => item.programme_name_fr),
      title: { text: "" },
    },
    yAxis: {
      title: { text: "" },
      endOnTick: false,
    },

    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      series: {
        groupPadding: 0.1,
        pointPadding: 0.1,
      },
    },
    series: [
      {
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
}

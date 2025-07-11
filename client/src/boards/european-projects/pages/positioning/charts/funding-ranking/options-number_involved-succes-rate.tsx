import * as Highcharts from "highcharts";

interface DataItem {
  name: string;
  ratio_involved: number;
}

export default function optionNumberInvolvedSuccessRate(data: DataItem[]): Highcharts.Options | null {
  if (!data) return null;

  // average ratio
  const total = data.reduce((acc, el) => acc + el.ratio_involved, 0);
  const average = total / data.length;

  return {
    chart: {
      type: "bar",
      height: 400,
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      visible: false,
    },
    yAxis: {
      plotLines: [
        {
          color: "#D75521",
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
        name: "Succès sur les participants",
        colors: ["#27A658"],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item.name,
          y: item.ratio_involved,
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
}

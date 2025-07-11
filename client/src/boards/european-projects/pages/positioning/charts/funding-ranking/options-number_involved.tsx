import * as Highcharts from "highcharts";

interface DataItem {
  name_fr: string;
  name_en: string;
  total_number_involved_evaluated: number;
  total_number_involved_successful: number;
  rank_number_involved_evaluated: number;
  rank_number_involved_successful: number;
}

export default function OptionsNumberInvolved(data: DataItem[], currentLang: string): Highcharts.Options | null {
  if (!data) return null;

  return {
    chart: {
      type: "bar",
      height: 400,
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      type: "category",
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Euros € (millions)",
      },
    },
    tooltip: {
      pointFormat: "Nombre de candidats : <b>{point.y}</b>",
    },
    plotOptions: {
      series: { dataLabels: { enabled: true } },
    },
    series: [
      {
        type: "bar",
        name: "Candidats",
        colors: ["#009099"],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}` as keyof DataItem],
          y: item.total_number_involved_evaluated,
          rank_number_involved_evaluated: item.rank_number_involved_evaluated,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.rank_number_involved_evaluated}e",
          },
        ],
      } as Highcharts.SeriesBarOptions,
      {
        type: "bar",
        name: "Participants",
        colors: ["#233E41"],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}` as keyof DataItem],
          y: item.total_number_involved_successful,
          rank_number_involved_successful: item.rank_number_involved_successful,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.rank_number_involved_successful}e",
          },
        ],
      } as Highcharts.SeriesBarOptions,
    ],
  };
}

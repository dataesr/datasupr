export default function OptionsNumberInvolved(data, currentLang) {
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
        name: "Candidats",
        colors: ["#009099"],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}`],
          y: item.total_number_involved_evaluated,
          rank_number_involved_evaluated: item.rank_involved_evaluated,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.rank_number_involved_evaluated}e",
          },
        ],
      },
      {
        name: "Participants",
        colors: ["#233E41"],
        colorByPoint: true,
        groupPadding: 0,
        data: data.map((item) => ({
          name: item[`name_${currentLang}`],
          y: item.total_number_involved_successful,
          rank_number_involved_successful: item.rank_involved_successful,
        })),
        dataLabels: [
          {
            align: "right",
            format: "{point.rank_number_involved_successful}e",
          },
        ],
      },
    ],
  };
}

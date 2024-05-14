function getOptions(series, categories, title, title_x_axis, title_y_axis) {
  return {
    title: { text: title },
    chart: { type: "column" },
    legend: { enabled: false },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: "{point.y:.1f}%",
        },
      },
    },
    series: [{ data: series }],
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: {
      title: { text: title_y_axis },
    },
    credits: {
      enabled: false,
    },
  };
}

function getLabel(graph, id, translations, currentLang) {
  return translations[graph] ? translations[graph][id][currentLang] : id;
}

export { getOptions, getLabel };

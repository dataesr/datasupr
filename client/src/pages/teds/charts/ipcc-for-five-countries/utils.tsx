import { getGeneralOptions } from "../utils";

function getOptions(series, categories, title, title_x_axis, title_y_axis) {
  const generalOptions = getGeneralOptions();
  return {
    ...generalOptions,
    legend: { enabled: true },
    title: { text: title },
    series,
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: {
      title: { text: title_y_axis },
    },
    plotOptions: {
      column: {
        stacking: "percent",
        dataLabels: {
          enabled: true,
          format: "{point.percentage:.0f}%",
        },
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>' +
        ": <b>{point.y}</b> ({point.percentage:.0f}%)<br/>",
      shared: true,
    },
  };
}

export { getOptions };

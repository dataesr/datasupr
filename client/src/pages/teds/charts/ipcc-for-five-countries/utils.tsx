import { getGeneralOptions } from "../utils";

function getOptions(series, categories, title, title_x_axis, title_y_axis) {
  const generalOptions = getGeneralOptions(
    title,
    categories,
    title_x_axis,
    title_y_axis
  );
  return {
    ...generalOptions,
    legend: { enabled: true },
    series,
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

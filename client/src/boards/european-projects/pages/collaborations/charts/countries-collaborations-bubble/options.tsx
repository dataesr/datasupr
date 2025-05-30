import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";

export default function Options(data, currentLang, nbToShow = 10) {
  if (!data) return null;

  console.log("Options data:", data);

  const newOptions: HighchartsInstance.Options = {
    // xAxis: {
    //   type: "category",
    // },
    // yAxis: [
    //   {
    //     min: 0,
    //     title: {
    //       text: "Euros € (millions)",
    //     },
    //   },
    // ],
    // tooltip: {
    //   pointFormat: "Total des subventions : <b>{point.y:.1f} €</b>",
    // },
    plotOptions: {
      packedbubble: {
        minSize: "30%",
        maxSize: "120%",
        // zMin: 0,
        // zMax: 1000,
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.02,
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          // filter: {
          //   property: "y",
          //   operator: ">",
          //   value: 250,
          // },
          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "normal",
          },
        },
      },
    },
    series: [
      {
        type: "packedbubble",
        name: "test",
        data: data.slice(0, nbToShow).map((item) => ({
          name: item[`country_name_${currentLang}`],
          value: item.total_collaborations,
        })),
      },
    ],
  };

  return CreateChartOptions("packedbubble", newOptions);
}

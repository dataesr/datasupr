import HighchartsInstance from "highcharts";
import Highcharts from "highcharts";

import variablePie from "highcharts/modules/variable-pie.js";
variablePie(Highcharts);

import { CreateChartOptions } from "../../../../components/chart-ep";
// import i18n from "./i18n.json";
// const rootStyles = getComputedStyle(document.documentElement);

export default function Options(data) {
  if (!data) return null;

  // function getI18nLabel(key) {
  //   return i18n[key][currentLang];
  // }

  const newOptions: HighchartsInstance.Options = {
    series: [
      {
        type: "variablepie",
        minPointSize: 10,
        innerSize: "20%",
        zMin: 0,
        name: "countries",
        borderRadius: 5,
        data: data["Excellent Science"]["Research infrastructures (INFRA)"],
      },
    ],
  };

  return CreateChartOptions("variablepie", newOptions);
}

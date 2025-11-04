import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToMillions } from "../../../../../../utils/format";

import i18n from "./i18n.json";

export default function Options(data, currentLang) {
  if (!data) return null;

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

const newOptions: HighchartsInstance.Options = {
  chart: {
    height: data.list.length * 20 + 150,
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    min: 0,
    title: {
      text: "Euros (M€)",
    },
  },
  tooltip: {
    pointFormat: getI18nLabel("total-subsidies") + "<b>{point.y:,.0f}</b> €",
  },
  series: [
    {
      type: "bar",
      name: "Total subventions (€)",
      color: "#4d2b5aff",
      groupPadding: 0,
      data: data.list.map((item) => [item.acronym || item.name, item.total_fund_eur]),
    },
  ],
  plotOptions: {
    series: {
      animation: false,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        formatter: function () {
          return formatToMillions(this.y ?? 0);
        },
      },
    },
  },
};

  return CreateChartOptions("bar", newOptions);
}

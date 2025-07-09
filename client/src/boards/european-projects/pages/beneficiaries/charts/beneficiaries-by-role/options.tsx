import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";

import i18n from "./i18n.json";
import { formatToMillions } from "../../../../../../utils/format";

const rootStyles = getComputedStyle(document.documentElement);

export default function Options(data, currentLang) {
  if (!data) return null;

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  interface DataItem {
    acronym?: string;
    entity_name?: string;
    total_fund_eur_coordination: number;
    total_fund_eur_partner: number;
  }

  interface ChartSeriesData {
    type: "bar";
    name: string;
    data: number[];
    color: string;
  }

  const newOptions: HighchartsInstance.Options = {
    xAxis: {
      categories: (data as DataItem[]).map((item) => item.acronym || item.entity_name || ""),
    },
    yAxis: {
      min: 0,
      title: {
        text: "Euros € (millions)",
      },
    },
    series: [
      {
        type: "bar",
        name: getI18nLabel("coordinator"),
        data: (data as DataItem[]).map((item) => item.total_fund_eur_coordination || 0),
        color: rootStyles.getPropertyValue("--coordination-color"),
      },
      {
        type: "bar",
        name: getI18nLabel("partner"),
        data: (data as DataItem[]).map((item) => item.total_fund_eur_partner || 0),
        color: rootStyles.getPropertyValue("--partner-color"),
      },
    ] as ChartSeriesData[],
    tooltip: {
      pointFormat: "{series.name}: " + getI18nLabel("total-subsidies") + "<b>{point.y:,.0f}</b> €",
    },
    plotOptions: {
      series: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return formatToMillions(this.y ?? 0);
          },
        },
      },
    },
    legend: {
      enabled: true,
    },
  };

  return CreateChartOptions("bar", newOptions);
}

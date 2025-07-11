import HighchartsInstance from "highcharts";

import { formatToMillions } from "../../../../../../utils/format";
import i18n from "../../../../i18n-global.json";
import { CreateChartOptions } from "../../../../components/chart-ep";

export default function Options(data, currentLang) {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);
  const evaluatedYears = new Set<string>();
  const successufulYears = new Set<string>();

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  data.evaluated.forEach((country) => {
    country.data.forEach((y) => {
      evaluatedYears.add(y.year);
    });
  });

  data.successful.forEach((country) => {
    country.data.forEach((y) => {
      successufulYears.add(y.year);
    });
  });

  const newOptions: HighchartsInstance.Options = {
    xAxis: [
      {
        type: "category",
        categories: Array.from(evaluatedYears),
        width: "48%",
        title: {
          text: getI18nLabel("evaluated-projects"),
        },
      },
      {
        type: "category",
        categories: Array.from(successufulYears),
        offset: 0,
        left: "50%",
        width: "48%",
        title: {
          text: getI18nLabel("successful-projects"),
        },
      },
    ],
    yAxis: [
      {
        lineWidth: 1,
        lineColor: "#E6E6E6",
        min: 0,
        title: {
          text: "M€",
        },
      },
      {
        min: 0,
        title: {
          text: "",
        },
        lineWidth: 1,
        lineColor: "#E6E6E6",
        left: "75%",
      },
    ],
    tooltip: {
      valueSuffix: " €",
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 3,
          lineWidth: 2,
          // lineColor: undefined,
        },
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            return formatToMillions(this.y as number);
          },
        },
      },
    },
    series: data.evaluated
      .map((country, index) => ({
        name: country[`name_${currentLang}`],
        data: country.data.map((year) => year.total_fund_eur),
        color: rootStyles.getPropertyValue(`--scale-${index + 1}-color`),
      }))
      .concat(
        data.successful.map((country, index) => ({
          xAxis: 1,
          name: country[`name_${currentLang}`],
          data: country.data.map((year) => year.total_fund_eur),
          color: rootStyles.getPropertyValue(`--scale-${index + 1}-color`),
        }))
      ),
  };

  return CreateChartOptions("line", newOptions);
}

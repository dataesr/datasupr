import HighchartsInstance from "highcharts";

import { CreateChartOptions } from "../../../../components/chart-ep";

import i18n from "./i18n.json";

export default function Options(data, currentLang) {
  if (!data || !data.countries || !data.years) return null;

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  // Générer des couleurs pour chaque pays
  const countryColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "line",
    },
    xAxis: {
      categories: data.years,
      title: {
        text: getI18nLabel("years"),
      },
      crosshair: true,
      accessibility: {
        description: "Years",
      },
    },
    yAxis: {
      title: {
        text: getI18nLabel("fund_eur"),
      },
      labels: {
        formatter: function () {
          return ((this.value as number) / 1000000).toFixed(1) + "M€";
        },
      },
    },
    tooltip: {
      shared: true,
      formatter: function () {
        let tooltip = `<b>Année: ${this.x}</b><br/>`;
        if (this.points) {
          this.points.forEach((point) => {
            const value = point.y || 0;
            tooltip += `${point.series.name}: <b>${(value / 1000000).toFixed(2)}M€</b><br/>`;
          });
        }
        return tooltip;
      },
    },
    // legend: {
    //   enabled: false,
    //   layout: "horizontal",
    //   align: "center",
    //   verticalAlign: "bottom",
    // },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4,
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3,
          },
        },
      },
    },
    series: data.countries.map((country, index) => ({
      name: country[`country_name_${currentLang}`] || country.country_code,
      data: country.evolution.map((item) => item.total_fund_eur),
      type: "line",
      color: countryColors[index % countryColors.length],
      marker: {
        symbol: "circle",
      },
    })),
  };

  return CreateChartOptions("line", newOptions);
}

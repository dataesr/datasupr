import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-ep";
import type { HighchartsOptions } from "../../../../../../components/chart-wrapper";

import i18nGlobal from "../../../../i18n-global.json";

export default function Options(data, displayType, currentLang): HighchartsOptions {
  if (!data) return null;
  const rootStyles = getComputedStyle(document.documentElement);

  function getI18nLabel(key) {
    return i18nGlobal[key][currentLang];
  }

  const years = new Set();
    const filteredData = data.filter((item) => item.country !== "all")[0].data;
    const allData = data.find((item) => item.country === "all").data;

    filteredData.find((item) => item.stage === "evaluated").pillars[0].years.forEach((year) => years.add(year.year));

    const newOptions: HighchartsInstance.Options = {
      title: { text: "" },
      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },
      credits: { enabled: false },
      xAxis: [
        {
          type: "category" as const,
          categories: Array.from(years).map(String),
          width: "48%",
          title: {
            text: getI18nLabel("evaluated-projects"),
          },
        },
        {
          type: "category" as const,
          categories: Array.from(years).map(String),
          offset: 0,
          left: "50%",
          width: "48%",
          title: {
            text: getI18nLabel("successful-projects"),
          },
        },
      ],
      plotOptions: {
        line: {
          marker: {
            enabled: true,
            symbol: "circle",
            radius: 3,
            lineWidth: 2,
            lineColor: undefined,
          },
          dataLabels: {
            enabled: true,
            formatter: function (this: Highcharts.TooltipFormatterContextObject) {
              return `${Number(this.y).toFixed(1)}%`;
            },
          },
        },
      },
      tooltip: {
        shared: true,
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          let s = `<b>${this.x}</b>`; // annee

          this.points?.forEach((point) => {
            s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${Number(point.y).toFixed(1)}%</b>`;
          });

          return s;
        },
      },
      series: filteredData
        .find((item) => item.stage === "evaluated")
        .pillars.map((pillar) => {
          const allPillarData = allData.find((item) => item.stage === "evaluated").pillars.find((p) => p.pilier_code === pillar.pilier_code);

          return {
            name: pillar[`pilier_name_${currentLang}`],
            data: pillar.years.map((year, index) => {
              const totalForYear = allPillarData.years[index][displayType];
              return totalForYear > 0 ? (year[displayType] / totalForYear) * 100 : 0;
            }),
            color: rootStyles.getPropertyValue(`--pillar-${pillar.pilier_code}-color`),
          };
        })
        .concat(
          filteredData
            .find((item) => item.stage === "successful")
            .pillars.map((pillar) => {
              const allPillarData = allData.find((item) => item.stage === "successful").pillars.find((p) => p.pilier_code === pillar.pilier_code);

              return {
                xAxis: 1,
                name: pillar[`pilier_name_${currentLang}`],
                data: pillar.years.map((year, index) => {
                  const totalForYear = allPillarData.years[index][displayType];
                  return totalForYear > 0 ? (year[displayType] / totalForYear) * 100 : 0;
                }),
                color: rootStyles.getPropertyValue(`--pillar-${pillar.pilier_code}-color`),
              };
            })
        ),
    };
  return CreateChartOptions("line", newOptions);
}

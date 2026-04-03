import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-ep";
import { formatToMillions } from "../../../../../../utils/format";
import { getCssColor } from "../../../../../../utils/colors";
import type { ErcDomainPanelEntitiesData } from "./query";

export default function Options(data: ErcDomainPanelEntitiesData, currentLang: string): HighchartsInstance.Options | null {
  if (!data?.list?.length) return null;

  const newOptions: HighchartsInstance.Options = {
    chart: {
      height: data.list.length * 30 + 150,
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Euros (M€)",
      },
      gridLineColor: "var(--background-default-grey-hover)",
      gridLineWidth: 0.5,
    },
    tooltip: {
      pointFormat: (currentLang === "fr" ? "Financement total : " : "Total funding: ") + "<b>{point.y:,.0f}</b> €",
    },
    series: [
      {
        type: "bar",
        name: currentLang === "fr" ? "Total subventions (€)" : "Total grants (€)",
        color: getCssColor("main-partner"),
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
      bar: {
        pointWidth: 25,
        borderWidth: 0,
        borderRadius: 0,
      },
    },
  };

  return CreateChartOptions("bar", newOptions);
}

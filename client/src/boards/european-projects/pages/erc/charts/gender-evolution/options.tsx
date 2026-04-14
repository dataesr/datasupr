import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import { CreateChartOptions } from "../../../../components/chart-ep";
import { getCssColor } from "../../../../../../utils/colors";
import type { GenderEvolutionData, GenderYearItem } from "./query";

function getPercent(item: GenderYearItem, gender: string): number {
  const found = item.genders.find((g) => g.gender === gender);
  if (!found || !item.total) return 0;
  return Math.round((found.count / item.total) * 1000) / 10;
}

export default function Options(data: GenderEvolutionData, currentLang: string): Highcharts.Options | null {
  if (!data?.years?.length) return null;

  const sorted = [...data.years].sort((a, b) => a.call_year.localeCompare(b.call_year));
  const categories = sorted.map((d) => d.call_year);

  const newOptions: Highcharts.Options = {
    chart: { type: "line", height: 380 },
    legend: { enabled: true },
    xAxis: {
      categories,
      title: { text: currentLang === "fr" ? "Année d'appel" : "Call year" },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: { text: "%" },
      gridLineColor: "var(--background-default-grey-hover)",
      gridLineWidth: 0.5,
      plotLines: [
        {
          value: 50,
          color: "var(--border-default-grey)",
          dashStyle: "Dash",
          width: 1,
          label: {
            text: "50%",
            align: "right",
            style: { color: "var(--text-mention-grey)", fontSize: "11px" },
          },
        },
      ],
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}%</b><br/>',
    },
    plotOptions: {
      line: {
        marker: { enabled: true, radius: 4 },
        dataLabels: {
          enabled: true,
          format: "{y}%",
          style: { fontSize: "10px", fontWeight: "normal", textOutline: "1px white" },
          y: -8,
        },
        connectNulls: false,
      },
    },
    series: [
      {
        type: "line",
        name: currentLang === "fr" ? "% Femmes" : "% Women",
        color: getCssColor("women-color"),
        data: sorted.map((d) => getPercent(d, "female")),
      },
      {
        type: "line",
        name: currentLang === "fr" ? "% Hommes" : "% Men",
        color: getCssColor("men-color"),
        data: sorted.map((d) => getPercent(d, "male")),
      },
      {
        type: "line",
        name: currentLang === "fr" ? "% Non binaire" : "% Non binary",
        color: getCssColor("unspecified-field-color"),
        data: sorted.map((d) => getPercent(d, "non binary")),
      },
    ],
  };

  return CreateChartOptions("line", newOptions);
}

import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-ep";
import { CONTINENT_COLORS } from "../../../../../../utils/continents";

type ContinentData = {
  name: string;
  y: number;
  continentKey: string;
};

export function getDonutOptions(data: ContinentData[], title: string) {
  const newOptions: HighchartsInstance.Options = {
    chart: {
      height: 300,
    },
    tooltip: {
      pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        innerSize: "60%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          style: {
            fontSize: "11px",
          },
        },
        showInLegend: false,
      },
    },
    series: [
      {
        type: "pie",
        name: title,
        data: data.map((item) => ({
          name: item.name,
          y: item.y,
          color: CONTINENT_COLORS[item.continentKey] || CONTINENT_COLORS["Autre"],
        })),
      },
    ],
  };

  return CreateChartOptions("pie", newOptions);
}

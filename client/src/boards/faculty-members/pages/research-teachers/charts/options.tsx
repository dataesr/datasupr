import Highcharts from "highcharts";
import { CreateChartOptions } from "../../../components/creat-chart-options";

export interface AgeGroupData {
  ageClass: string;
  count: number;
  percent: number;
}

export interface CnuGroupData {
  cnuGroupId: string;
  cnuGroupLabel: string;
  totalCount: number;
  ageDistribution: AgeGroupData[];
}

export const createCnuAgeOptions = (
  cnuGroups: CnuGroupData[]
): Highcharts.Options | null => {
  if (!cnuGroups || cnuGroups.length === 0) return null;

  const sortedCnuGroups = [...cnuGroups]
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 10);

  const ageCategories = ["35 ans et moins", "36 à 55 ans", "56 ans et plus"];
  const ageColors = {
    "35 ans et moins": "var(--blue-cumulus-sun-368)",
    "36 à 55 ans": "var(--blue-cumulus-main-526)",
    "56 ans et plus": "var(--blue-ecume-moon-675)",
  };

  const categories = sortedCnuGroups.map(
    (group) => `${group.cnuGroupLabel} (${group.totalCount})`
  );

  const seriesData = ageCategories.map((ageCategory) => {
    return {
      type: "bar" as const,
      name: ageCategory,
      color: ageColors[ageCategory],
      data: sortedCnuGroups.map((group) => {
        const ageData = group.ageDistribution.find(
          (age) => age.ageClass === ageCategory
        );
        return {
          y: ageData ? ageData.percent : 0,
          count: ageData ? ageData.count : 0,
          total: group.totalCount,
        };
      }),
    };
  });

  const newOptions: Highcharts.Options = {
    chart: {
      type: "bar",
      height: Math.max(300, 100 + categories.length * 30), 
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: "",
    },
    xAxis: {
      categories,
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: "500",
        },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Pourcentage",
        style: {
          fontSize: "11px",
        },
      },
      labels: {
        format: "{value}%",
        style: {
          fontSize: "10px",
        },
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        fontSize: "10px",
      },
      itemMarginBottom: 5,
    },
    tooltip: {
      formatter: function () {
        const point = this.point as Highcharts.Point & { count: number; total: number };
        return `<b>${this.series.name}</b><br/>
                ${this.x}<br/>
                <b>${point.y?.toFixed(1) || 0}%</b> (${point.count} personnes)<br/>
                ${point.count} sur ${point.total} enseignants-chercheurs`;
      },
      style: {
        fontSize: "11px",
      },
    },
    plotOptions: {
      bar: {
        stacking: "normal",
        pointWidth: 18,
        dataLabels: {
          enabled: true,
          format: "{y:.1f}%",
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            textOutline: "1px contrast",
          },
          filter: {
            property: "y",
            operator: ">",
            value: 5,
          },
        },
      },
      series: {
        borderWidth: 0,
      },
    },
    credits: {
      enabled: false,
    },
    series: seriesData,
  };

  return CreateChartOptions("bar", newOptions);
};

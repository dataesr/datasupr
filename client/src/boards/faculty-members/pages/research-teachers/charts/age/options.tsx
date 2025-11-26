import Highcharts from "highcharts";
import { CreateChartOptions } from "../../../../components/creat-chart-options";

export interface AgeGroupData {
  ageClass: string;
  count: number;
  percent: number;
}

export interface CategoryData {
  categoryName: string;
  count: number;
}

export interface CnuGroupData {
  cnuGroupId: string;
  cnuGroupLabel: string;
  totalCount: number;
  ageDistribution: AgeGroupData[];
  categories: CategoryData[];
  maleCount?: number;
  femaleCount?: number;
}

export const createAgeCategoryOptions = (
  cnuGroups: CnuGroupData[]
): Highcharts.Options | null => {
  if (!cnuGroups || cnuGroups.length === 0) return null;

  const sortedCnuGroups = [...cnuGroups]
    .filter(
      (group) =>
        group.ageDistribution &&
        group.ageDistribution.length > 0 &&
        group.categories &&
        group.categories.length > 0
    )
    .sort((a, b) => b.totalCount - a.totalCount);

  const ageCategoriesOrder = [
    "35 ans et moins",
    "36 à 55 ans",
    "56 ans et plus",
  ];

  const allCategories = Array.from(
    new Set(
      sortedCnuGroups.flatMap((group) =>
        group.categories.map((cat) => cat.categoryName)
      )
    )
  ).filter((name) => name !== null && name !== undefined && name !== "");

  const categoryColors: { [key: string]: string } = {};
  const predefinedColors = [
    "var(--blue-france-sun-113-625)",
    "var(--green-archipel-main-557)",
    "var(--blue-cumulus-main-526)",
    // "var(--red-marianne-sun-113-625)",
    // "var(--purple-glycine-sun-113-625)",
    // "var(--orange-terre-battue-sun-113-625)",
    // "var(--blue-cumulus-sun-368)",
    // "var(--green-menthe-sun-368)",
    // "var(--yellow-moutarde-sun-368)",
    // "var(--brown-opera-sun-368)",
    // "var(--pink-macaron-sun-368)",
  ];
  allCategories.forEach((cat, index) => {
    categoryColors[cat] = predefinedColors[index % predefinedColors.length];
  });

  const aggregatedData: {
    [ageClass: string]: { [categoryName: string]: number };
  } = {};
  const totalCountsPerAgeClass: { [ageClass: string]: number } = {};

  ageCategoriesOrder.forEach((ageClass) => {
    aggregatedData[ageClass] = {};
    totalCountsPerAgeClass[ageClass] = 0;
  });

  sortedCnuGroups.forEach((group) => {
    const ageProportions: { [ageClass: string]: number } = {};
    group.ageDistribution.forEach((ageDist) => {
      if (ageCategoriesOrder.includes(ageDist.ageClass)) {
        ageProportions[ageDist.ageClass] =
          group.totalCount > 0 ? ageDist.count / group.totalCount : 0;
      }
    });

    group.categories.forEach((category) => {
      if (category.categoryName) {
        Object.entries(ageProportions).forEach(([ageClass, proportion]) => {
          const distributedCount = category.count * proportion;
          aggregatedData[ageClass][category.categoryName] =
            (aggregatedData[ageClass][category.categoryName] || 0) +
            distributedCount;
          totalCountsPerAgeClass[ageClass] += distributedCount;
        });
      }
    });
  });

  const seriesData: Highcharts.SeriesOptionsType[] = allCategories.map(
    (categoryName) => {
      return {
        type: "column",
        name: categoryName,
        color: categoryColors[categoryName],
        data: ageCategoriesOrder.map((ageClass) => {
          const count = aggregatedData[ageClass][categoryName] || 0;
          const totalInAgeClass = totalCountsPerAgeClass[ageClass];
          const percentOfAgeClass =
            totalInAgeClass > 0 ? (count / totalInAgeClass) * 100 : 0;

          return {
            y: Math.round(count),
            ageClass: ageClass,
            categoryName: categoryName,
            totalInAgeClass: Math.round(totalInAgeClass),
            percentOfAgeClass: parseFloat(percentOfAgeClass.toFixed(1)),
          };
        }),
      };
    }
  );

  const newOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: Math.max(300, 100 + ageCategoriesOrder.length * 30),
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ageCategoriesOrder,
      title: {
        text: "Tranche d'âge",
        style: {
          fontSize: "11px",
          color: "var(--text-default-grey)",
        },
      },
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: "500",
          color: "var(--text-default-grey)",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre de personnes",
        style: {
          fontSize: "11px",
          color: "var(--text-default-grey)",
        },
      },
      labels: {
        format: "{value}",
        style: {
          fontSize: "10px",
          color: "var(--text-default-grey)",
        },
      },
      allowDecimals: false,
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        fontSize: "10px",
        fontWeight: "normal",
        color: "var(--text-default-grey)",
      },
      itemHoverStyle: {
        color: "var(--blue-france-sun-113-625)",
      },
      itemMarginBottom: 5,
      title: {
        text: "Catégorie de personnel",
        style: {
          fontWeight: "bold",
          fontSize: "11px",
          paddingBottom: "5px",
        },
      },
      symbolRadius: 0,
      squareSymbol: true,
    },
    tooltip: {
      formatter: function () {
        const point = this.point as Highcharts.Point & {
          count: number;
          ageClass: string;
          categoryName: string;
          totalInAgeClass: number;
          percentOfAgeClass: number;
        };
        return `<b>${point.categoryName}</b><br/>
                Tranche d'âge: ${point.ageClass}<br/>
                Nombre de personnes: <b>${point.y}</b><br/>
                Représente <b>${point.percentOfAgeClass}&nbsp;%</b> de cette tranche d'âge (${point.totalInAgeClass} personnes au total).`;
      },
      style: {
        fontSize: "11px",
        color: "var(--text-default-grey)",
      },
    },
    plotOptions: {
      column: {
        grouping: true,
        pointPadding: 0.1,
        groupPadding: 0.2,
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            color: "var(--text-inverted-grey)",
            textOutline: "none",
          },
          filter: {
            property: "y",
            operator: ">",
            value: 0,
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

  return CreateChartOptions("column", newOptions);
};

import Highcharts from "highcharts";

const rootStyles = getComputedStyle(document.documentElement);

interface AgeData {
  age_class: string;
  headcount: number;
}

interface RegionData {
  geo_id: string;
  geo_nom: string;
  totalHeadcount: number;
  totalHeadcountWoman?: number;
  totalHeadcountMan?: number;
  age_distribution: AgeData[];
}

const AGE_COLORS = {
  "35 ans et moins": rootStyles.getPropertyValue("--green-bourgeon-925"),
  "36 à 55 ans": rootStyles.getPropertyValue("--green-menthe-925"),
  "56 ans et plus": rootStyles.getPropertyValue("--blue-cumulus-sun-368"),
};

export function createPieChartOptions(
  region: RegionData
): Highcharts.Options | null {
  if (!region.age_distribution) return null;

  const totalCount = region.age_distribution.reduce(
    (sum, age) => sum + age.headcount,
    0
  );

  const pieData = region.age_distribution.map((age) => ({
    name: age.age_class,
    y: totalCount > 0 ? (age.headcount / totalCount) * 100 : 0,
    count: age.headcount,
  }));

  const sortOrder = {
    "35 ans et moins": 1,
    "36 à 55 ans": 2,
    "56 ans et plus": 3,
  };

  pieData.sort((a, b) => {
    if (sortOrder[a.name] !== undefined && sortOrder[b.name] !== undefined) {
      return sortOrder[a.name] - sortOrder[b.name];
    }
    return a.name.localeCompare(b.name);
  });

  return {
    chart: {
      type: "pie",
      height: 250,
      style: {
        fontFamily: "'Marianne', sans-serif",
      },
      backgroundColor: "transparent",
      spacing: [10, 0, 0, 0],
    },
    title: {
      text: `${region.geo_nom}`,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
      align: "center",
      margin: 15,
    },
    subtitle: {
      text: `${region.totalHeadcount.toLocaleString("fr-FR")} enseignants`,
      style: {
        fontSize: "13px",
        color: "#666666",
      },
      align: "center",
    },
    tooltip: {
      pointFormat:
        "{point.name}: <b>{point.percentage:.1f}%</b><br>({point.count} enseignants)",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderWidth: 0,
      shadow: true,
      style: {
        fontSize: "12px",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "60%"],
        size: "150%",
        dataLabels: {
          enabled: true,
          format: "{point.percentage:.1f}%",
          distance: -25,
          style: {
            fontWeight: "bold",
            color: "white",
            textOutline: "1px contrast",
            fontSize: "12px",
            textShadow: "0px 0px 3px rgba(0, 0, 0, 0.5)",
          },
          filter: {
            property: "percentage",
            operator: ">",
            value: 5,
          },
        },
        showInLegend: true,
        colors: pieData.map((item) => AGE_COLORS[item.name] || "#CCCCCC"),
        borderWidth: 0,
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Âge",
        colorByPoint: true,
        data: pieData,
        type: "pie",
        innerSize: "40%",
      } as Highcharts.SeriesPieOptions,
    ],
  };
}

export function createGenderBarOptions(region: RegionData): Highcharts.Options {
  const femaleCount = region.totalHeadcountWoman || 0;
  const maleCount = region.totalHeadcountMan || 0;
  const totalCount = femaleCount + maleCount;
  const femalePercent = totalCount > 0 ? (femaleCount / totalCount) * 100 : 0;
  const malePercent = totalCount > 0 ? (maleCount / totalCount) * 100 : 0;

  return {
    chart: {
      type: "bar",
      height: 40,
      backgroundColor: "transparent",
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: [""],
      lineWidth: 0,
      labels: {
        enabled: false,
      },
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        const femme = this.point.series.name === "Femmes";
        return `<b>${femme ? "Femmes" : "Hommes"}</b>: ${Math.round(
          this.y || 0
        )}% (${femme ? femaleCount : maleCount} enseignants)`;
      },
      shadow: true,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      series: {
        stacking: "percent",
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          formatter: function (this: Highcharts.PointLabelObject) {
            const value = Math.round(this.y || 0);
            if (value < 10) return "";
            return `${value}%`;
          },
          style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: "white",
            textOutline: "1px contrast",
          },
        },
      },
      bar: {
        pointWidth: 30,
        borderRadius: 3,
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Hommes",
        data: [malePercent],
        color: rootStyles.getPropertyValue("--men-color"),
        type: "bar",
      },
      {
        name: "Femmes",
        data: [femalePercent],
        color: rootStyles.getPropertyValue("--women-color"),
        type: "bar",
      },
    ],
  };
}

export { AGE_COLORS };

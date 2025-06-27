import Highcharts from "highcharts";

interface DataPoint {
  name: string;
  y: number;
  x: number;
  cnuGroupId: string | number;
  color: Highcharts.ColorType;
  maleCount: number;
  femaleCount: number;
  malePercent: number;
  femalePercent: number;
  cnuGroupPercent: number;
}

interface GroupedData {
  discipline: string;
  groups: unknown[];
  totalCount: number;
}

export const createCnuGroupsChartOptions = (
  data: DataPoint[],
  categories: string[],
  groupedData: GroupedData[]
): Highcharts.Options => {
  return {
    chart: {
      type: "column",
      height: 600,
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
          fontWeight: "bold",
          fontSize: "12px",
        },
        formatter: function () {
          const index = categories.indexOf(this.value as string);
          const totalCount = groupedData[index]?.totalCount || 0;
          return `${
            this.value
          }<br><span style="font-weight:normal;font-size:12px;">${totalCount.toLocaleString()} pers.</span>`;
        },
        useHTML: true,
      },
    },
    yAxis: {
      title: {
        text: "Effectifs",
      },
      labels: {
        formatter: function () {
          const value = Number(this.value);
          return value >= 1000 ? `${value / 1000}k` : value.toString();
        },
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        const point = this.point as Highcharts.Point & DataPoint;
        return `<div style="padding:8px">
                <div style="font-weight:bold;margin-bottom:5px">${
                  point.name
                }</div>
                <div style="font-size:14px;font-weight:bold;margin-bottom:8px">${point.y.toLocaleString()} enseignants</div>
                <div style="color:#666;margin-bottom:5px">${
                  point.cnuGroupPercent
                }% de la discipline</div>
                <div style="margin-top:8px">👨 Hommes: ${point.maleCount.toLocaleString()} (${
          point.malePercent
        }%)</div>
                <div>👩 Femmes: ${point.femaleCount.toLocaleString()} (${
          point.femalePercent
        }%)</div>
                </div>`;
      },
    },
    plotOptions: {
      column: {
        stacking: "percent",
        borderWidth: 0,
        borderRadius: 2,
      },
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            const point = this.point as Highcharts.Point & DataPoint;
            if (point.y < 1000) return "";
            return `Gr.${point.cnuGroupId} (${point.cnuGroupPercent}%)`;
          },
          style: {
            fontSize: "11px",
            fontWeight: "normal",
            color: "#FFFFFF",
            textOutline: "1px contrast",
          },
        },
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
        name: "Groupes CNU",
        data: data,
        pointPadding: 0.1,
        groupPadding: 0.2,
        colorByPoint: true,
        type: "column",
      },
    ],
  };
};

export const getColorForDiscipline = (discipline: string) => {
  if (discipline.includes("Science")) return "#3558a2";
  if (discipline.includes("Lettre") || discipline.includes("humaine"))
    return "#a94645";
  if (discipline.includes("Droit") || discipline.includes("économie"))
    return "#6e445a";
  if (discipline.includes("Médecine")) return "#a94645";
  if (discipline.includes("Pharma")) return "#009099";
  return "#fcc63a";
};

export const getShade = (baseColor: string, index: number, total: number) => {
  const opacity = Math.max(0.3, 1 - (index * 0.7) / Math.max(1, total - 1));
  return Highcharts.color(baseColor).setOpacity(opacity).get();
};

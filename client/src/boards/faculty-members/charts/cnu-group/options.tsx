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

const truncateText = (text: string, maxLength: number = 18): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const createCnuGroupsChartOptions = (
  data: DataPoint[],
  categories: string[],
  groupedData: GroupedData[]
): Highcharts.Options => {
  return {
    chart: {
      type: "column",
      height: 650,

      spacing: [10, 10, 60, 10],
    },
    title: {
      text: "",
    },
    xAxis: {
      categories,
      labels: {
        rotation: -45,
        align: "right",
        style: {
          fontSize: "11px",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        formatter: function () {
          const index = categories.indexOf(this.value as string);
          const totalCount = groupedData[index]?.totalCount || 0;
          const truncatedValue = truncateText(this.value as string);

          return `<span title="${
            this.value
          }">${truncatedValue}</span> <span style="font-weight:normal;color:#666666">(${totalCount.toLocaleString()})</span>`;
        },
        useHTML: true,
        y: 10,
      },
      lineWidth: 1,
      lineColor: "#E0E0E0",
      tickWidth: 1,
      tickColor: "#E0E0E0",
      tickLength: 5,
    },
    yAxis: {
      title: {
        text: "Effectifs",
        style: {
          color: "#666666",
          fontSize: "12px",
        },
      },
      labels: {
        formatter: function () {
          const value = Number(this.value);
          return value >= 1000
            ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
            : value.toString();
        },
        style: {
          color: "#666666",
        },
      },
      gridLineColor: "#F0F0F0",
      gridLineDashStyle: "Dash",
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      shadow: true,
      formatter: function () {
        const point = this.point as Highcharts.Point & DataPoint;
        return `<div style="padding:10px">
                <div style="font-weight:bold;margin-bottom:8px;font-size:13px">${
                  point.name
                }</div>
                <div style="font-size:16px;font-weight:bold;margin-bottom:10px">${point.y.toLocaleString()} enseignants</div>
                <div style="color:#666;margin-bottom:8px">${
                  point.cnuGroupPercent
                }% de la discipline</div>
                <hr style="margin:5px 0;border:0;border-top:1px solid #eee">
                <table style="width:100%;border-collapse:collapse">
                  <tr>
                    <td style="padding:4px 0">👨 Hommes:</td>
                    <td style="text-align:right;font-weight:bold">${point.maleCount.toLocaleString()}</td>
                    <td style="text-align:right;width:40px;color:#666">${
                      point.malePercent
                    }%</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0">👩 Femmes:</td>
                    <td style="text-align:right;font-weight:bold">${point.femaleCount.toLocaleString()}</td>
                    <td style="text-align:right;width:40px;color:#666">${
                      point.femalePercent
                    }%</td>
                  </tr>
                </table>
                </div>`;
      },
    },
    plotOptions: {
      column: {
        stacking: "percent",
        borderWidth: 0,
        borderRadius: 3,
        groupPadding: 0.15,
        pointPadding: 0.05,
      },
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            const point = this.point as Highcharts.Point & DataPoint;
            if (point.y < 1000) return "";
            return `Gr.${point.cnuGroupId}`;
          },
          style: {
            fontSize: "11px",
            fontWeight: "normal",
            color: "#FFFFFF",
            textOutline: "1px contrast",
          },
          y: -5,
        },
        states: {
          hover: {
            brightness: 0.1,
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
        colorByPoint: true,
        type: "column",
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              height: 700,
            },
            xAxis: {
              labels: {
                rotation: -60,
                style: {
                  fontSize: "9px",
                },
              },
            },
          },
        },
      ],
    },
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

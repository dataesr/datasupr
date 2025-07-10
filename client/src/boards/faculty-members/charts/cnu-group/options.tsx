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
  disciplineIndex: number;
}

interface GroupedData {
  discipline: string;
  groups: { cnuGroupId: string | number }[];
  totalCount: number;
}

export const createCnuGroupsChartOptions = (
  data: DataPoint[],
  categories: string[],
  groupedData: GroupedData[],
  isGroupedView: boolean
): Highcharts.Options => {
  const seriesData = isGroupedView
    ? data
        .map((point) => {
          const disciplineIndex = point.x;
          const disciplineInfo = groupedData[disciplineIndex];
          if (!disciplineInfo || disciplineInfo.groups.length === 0)
            return null;

          const numberOfGroups = disciplineInfo.groups.length;
          const groupIndex = disciplineInfo.groups.findIndex(
            (g) => g.cnuGroupId === point.cnuGroupId
          );
          if (groupIndex === -1) return null;

          const barWidthInPixels = 12;
          const spacingInPixels = 4;

          const groupWidthInPixels =
            numberOfGroups * barWidthInPixels +
            Math.max(0, numberOfGroups - 1) * spacingInPixels;

          const pixelToAxisUnitRatio = 1 / (groupWidthInPixels * 2);
          const groupWidth = groupWidthInPixels * pixelToAxisUnitRatio;

          const startOffset = -groupWidth / 2;
          const barOffset =
            groupIndex *
            (barWidthInPixels + spacingInPixels) *
            pixelToAxisUnitRatio;

          const xPos = disciplineIndex + startOffset + barOffset;

          return {
            ...point,
            x: xPos,
            disciplineIndex: disciplineIndex,
          };
        })
        .filter(Boolean)
    : data;

  return {
    chart: {
      type: "column",
      height: 450,
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      categories,
      min: 0,
      max: categories.length - 1,
      labels: {
        rotation: 0,
        y: 20,
        style: {
          fontSize: "13px",
        },
        formatter: function () {
          return `<div style="width: 100px; text-align: center; white-space: normal;">${this.value}</div>`;
        },
        useHTML: true,
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
      },
      gridLineColor: "#F0F0F0",
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      shadow: false,
      positioner: function (labelWidth, labelHeight, point) {
        const chart = this.chart;
        const plotLeft = chart.plotLeft;
        const plotWidth = chart.plotWidth;
        const plotTop = chart.plotTop;
        const plotHeight = chart.plotHeight;

        let x = plotLeft + point.plotX - labelWidth / 2;
        let y = plotTop + point.plotY - labelHeight - 10;

        if (x < plotLeft) {
          x = plotLeft;
        }

        if (x + labelWidth > plotLeft + plotWidth) {
          x = plotLeft + plotWidth - labelWidth;
        }

        if (y + labelHeight > plotTop + plotHeight) {
          y = plotTop + plotHeight - labelHeight;
        }

        if (y < plotTop) {
          y = plotTop;
        }

        return {
          x: x,
          y: y,
        };
      },
      formatter: function () {
        const point = this.point as Highcharts.Point & DataPoint;
        const disciplineInfo = groupedData[point.disciplineIndex];
        const disciplineTotal = disciplineInfo.totalCount;
        const disciplineName = disciplineInfo.discipline;

        return `<div style="padding:10px">
                <div style="font-weight:bold;margin-bottom:5px;font-size:13px">${
                  point.name
                }</div>
                <div style="font-size:12px;color:#666;margin-bottom:8px">Discipline: ${disciplineName} (${disciplineTotal.toLocaleString()} enseignants)</div>
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
        borderWidth: 0,
        borderRadius: 3,
        colorByPoint: true,
        grouping: false,
        pointWidth: 12,
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
        name: "Enseignants",
        type: "column",
        data: seriesData,
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

export const getShade = (baseColor: string, index: number, total: number) => {
  const opacity = Math.max(0.3, 1 - (index * 0.7) / Math.max(1, total - 1));
  return Highcharts.color(baseColor).setOpacity(opacity).get();
};

import Highcharts from "highcharts";
import { formatToPercent } from "../../../../../../utils/format";

interface BubbleData {
  x: number;
  y: number;
  z: number;
  name: string;
  color: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  sectionCode: string;
}

interface BubbleOptionsParams {
  title: string;
  selectedYear: string;
  bubbleData: BubbleData[];
  maxValue: number;
  padding: number;
  labels: {
    sectionSingular: string;
    sectionPlural: string;
  };
}

export const createBubbleOptions = ({
  title,
  selectedYear,
  bubbleData,
  maxValue,
  padding,
  labels,
}: BubbleOptionsParams): Highcharts.Options => {
  const diagonalLine = {
    type: "line" as const,
    data: [
      [0, 0],
      [maxValue, maxValue],
    ],
    color: "#cccccc",
    dashStyle: "Dash" as const,
    lineWidth: 2,
    marker: { enabled: false },
    showInLegend: false,
    enableMouseTracking: false,
  };

  return {
    chart: {
      type: "bubble",
      height: 700,
      style: {
        fontFamily: "Marianne, sans-serif",
      },
      backgroundColor: "#ffffff",
    },
    exporting: { enabled: false },
    title: {
      text: title,
      style: {
        color: "#000000",
        fontSize: "18px",
        fontWeight: "bold",
      },
      align: "left",
    },
    subtitle: {
      text: `Année universitaire ${selectedYear} - ${bubbleData.length} ${labels.sectionPlural}`,
      style: {
        color: "#666666",
        fontSize: "14px",
      },
      align: "left",
    },
    xAxis: {
      title: {
        text: "Nombre de femmes",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      min: -padding,
      max: maxValue + padding,
      gridLineWidth: 1,
      gridLineColor: "#f0f0f0",
    },
    yAxis: {
      title: {
        text: "Nombre d'hommes",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      min: -padding,
      max: maxValue + padding,
      gridLineWidth: 1,
      gridLineColor: "#f0f0f0",
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        const point = this.point as unknown as BubbleData;
        const femalePercent =
          point.totalCount > 0
            ? Math.round((point.femaleCount / point.totalCount) * 100)
            : 0;
        const malePercent = 100 - femalePercent;

        return `
          <div style="padding: 10px; background: white; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px; color: #000091;">
              ${point.sectionCode}
            </div>
            <div style="font-size: 12px; margin-bottom: 8px; color: #666;">
              ${point.name.split(" - ")[1] || point.name}
            </div>
            <div style="margin-bottom: 5px;">
              <strong>Effectif total:</strong> ${point.totalCount.toLocaleString()} enseignants
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #e18b76;">♀ Femmes:</span>
              <span><strong>${point.femaleCount.toLocaleString()}</strong> (${formatToPercent(
          femalePercent
        )})</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #efcb3a;">♂ Hommes:</span>
              <span><strong>${point.maleCount.toLocaleString()}</strong> (${formatToPercent(
          malePercent
        )})</span>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      bubble: {
        minSize: 10,
        maxSize: 80,
        dataLabels: {
          enabled: true,
          format: "{point.sectionCode}",
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            textOutline: "1px contrast",
          },
          filter: {
            property: "z",
            operator: ">",
            value: 1000,
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "bubble",
        data: bubbleData,
      },
      diagonalLine,
    ],
    credits: { enabled: false },
  };
};

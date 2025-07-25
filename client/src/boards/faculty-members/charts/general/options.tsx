import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../components/creat-chart-options";
import { getColorForDiscipline } from "../../utils";

interface Field {
  year: string;
  field_id: string;
  fieldLabel: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

interface OptionsProps {
  fieldsData: Field[];
  selectedYear: string;
}

export default function OptionsColumnChart({
  fieldsData,
  selectedYear,
}: OptionsProps): HighchartsInstance.Options | null {
  if (!fieldsData || fieldsData.length === 0) return null;

  const yearData = fieldsData.filter((field) => field.year === selectedYear);
  if (yearData.length === 0) return null;

  const sortedData = [...yearData].sort((a, b) => b.totalCount - a.totalCount);

  const categories = sortedData.map((field) => field.fieldLabel);

  const data = sortedData.map((field) => ({
    name: field.fieldLabel,
    code: field.field_id,
    y: field.totalCount,
    color: getColorForDiscipline(field.fieldLabel),
    customData: {
      femaleCount: field.femaleCount,
      maleCount: field.maleCount,
      femalePercentage: Math.round(
        (field.femaleCount / field.totalCount) * 100
      ),
      malePercentage: Math.round((field.maleCount / field.totalCount) * 100),
    },
  }));

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      inverted: true,
      height: 450,
      marginLeft: 150,
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    exporting: { enabled: false },
    title: {
      text: "",
    },
    xAxis: {
      categories,
      crosshair: true,
      labels: {
        style: {
          color: "#333333",
          fontSize: "12px",
        },
        align: "right",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'enseignants",
        style: {
          color: "#333333",
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          color: "#333333",
          fontSize: "14px",
        },
        formatter() {
          return Number(this.value) >= 1000
            ? `${Number(this.value) / 1000}k`
            : String(this.value);
        },
      },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#FFFFFF",
      borderColor: "#CCCCCC",
      borderRadius: 8,
      shadow: true,
      formatter() {
        interface CustomPoint extends Highcharts.Point {
          code: string;
          customData: {
            femaleCount: number;
            maleCount: number;
            femalePercentage: number;
            malePercentage: number;
          };
        }
        const p = this.point as CustomPoint;
        return `
          <div style="padding:10px">
            <div style="font-weight:bold;margin-bottom:8px;font-size:14px">
              ${p.name}&nbsp;${p.code}
            </div>
            <div style="margin:8px 0; font-size:14px; font-weight:bold;">
              ${p.y !== undefined ? p.y.toLocaleString() : 0} enseignants
            </div>
            <hr style="margin:5px 0;border:0;border-top:1px solid #eee">
            <table style="width:100%;border-collapse:collapse">
                  <tr>
                    <td style="padding:4px 0">👨 Hommes:</td>
                    <td style="text-align:right;font-weight:bold;font-size:14px">${p.customData.maleCount.toLocaleString()}</td>
                    <td style="text-align:right;width:40px;color:#666;font-size:14px">${
                      p.customData.malePercentage
                    }%</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0">👩 Femmes:</td>
                    <td style="text-align:right;font-weight:bold;font-size:14px">${p.customData.femaleCount.toLocaleString()}</td>
                    <td style="text-align:right;width:40px;color:#666;font-size:14px">${
                      p.customData.femalePercentage
                    }%</td>
                  </tr>
                </table>
          </div>
        `;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0,
        minPointLength: 1.5,
      },
    },
    series: [
      {
        name: "Enseignants",
        type: "column",
        data,
        colorByPoint: true,
      },
    ],
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return CreateChartOptions("column", options);
}

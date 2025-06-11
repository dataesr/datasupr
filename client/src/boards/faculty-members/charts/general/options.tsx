import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../components/creat-chart-options";

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
  const limitedData = sortedData.slice(0, 7);

  const categories = limitedData.map((field) => field.fieldLabel);

  const colors = [
    "#fddbfa",
    "#73e0cf",
    "#6e445a",
    "#a94645",
    "#9ef9be",
    "#e6feda",
    "#c9fcac",
  ];

  const data = limitedData.map((field, index) => ({
    name: field.fieldLabel,
    y: field.totalCount,
    color: colors[index % colors.length],
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
      height: 450,
      marginLeft: 0,
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: "Répartition par disciplines",
      style: {
        color: "#000000",
        fontSize: "18px",
        fontWeight: "bold",
      },
      align: "left",
    },
    subtitle: {
      text: `Année universitaire ${selectedYear}`,
      style: {
        color: "#666666",
        fontSize: "14px",
      },
      align: "left",
    },
    xAxis: {
      categories,
      crosshair: true,
      labels: {
        style: {
          color: "#333333",
          fontSize: "12px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'enseignants",
        style: {
          color: "#333333",
          fontSize: "12px",
        },
      },
      labels: {
        style: {
          color: "#333333",
          fontSize: "12px",
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
            <strong style="font-size:15px;">${p.name}</strong>
            <div style="margin:8px 0; font-size:16px; font-weight:bold;">
              ${p.y !== undefined ? p.y.toLocaleString() : 0} enseignants
            </div>
            <div style="margin-top:5px; color:#e18b76">
              Femmes: ${p.customData.femalePercentage}% (${
          p.customData.femaleCount
        })
            </div>
            <div style="margin-top:3px; color:#efcb3a">
              Hommes: ${p.customData.malePercentage}% (${
          p.customData.maleCount
        })
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0,
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

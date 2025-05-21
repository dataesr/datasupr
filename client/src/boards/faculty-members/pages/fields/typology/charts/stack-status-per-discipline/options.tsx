import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../../components/chart-faculty-members";

interface Status {
    statusData: Array<{
        disciplines?: Array<{
        fieldLabel: string;
        fieldId?: string;
        totalCount: number;
        status?: {
            enseignantsChercheurs?: { count: number };
            titulaires?: { count: number };
            };
        }>;
    }>;
      isLoading: boolean;
      year: string;
      fieldId?: string;
}
  
interface OptionsProps {
    statusData: Status[];
    selectedYear: string;
}
  
export default function OptionsStackChart({
    statusData,
    selectedYear,
}: OptionsProps) : HighchartsInstance.Options | null {
    if (!statusData || !statusData[0] || !statusData[0].disciplines) return null;
    
    const disciplines = [...statusData[0].disciplines].sort(
        (a, b) => b.totalCount - a.totalCount
      );
    
    const categories = disciplines.map((d) => d.fieldLabel);

    const ecData = disciplines.map(
      (d) => d.status?.enseignantsChercheurs?.count || 0
    );
    const autresTitulairesData = disciplines.map(
      (d) =>
        (d.status?.titulaires?.count || 0) -
        (d.status?.enseignantsChercheurs?.count || 0)
    );
    const nonTitulairesData = disciplines.map(
      (d) => d.totalCount - (d.status?.titulaires?.count || 0)
    );

    const rootStyles = getComputedStyle(document.documentElement);

    const options: Highcharts.Options = {
        chart: {
            type: "bar",
            height: 600,
            style: {
                fontFamily: "Marianne, sans-serif",
              },
        },
        title: {
          text: "Répartition par statuts par discipline",
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
          categories: categories,
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
            text: "Effectif",
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
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color: "gray",
              textOutline: "none",
            },
            formatter: function () {
              return this.total.toLocaleString();
            },
          },
        },
        tooltip: {
          valueSuffix: " personnes",
          shared: true,
        },
        plotOptions: {
          bar: {
            stacking: "normal",
            dataLabels: {
              enabled: false,
            },
            cursor: "pointer",
            point: {
              events: {
                click: function () {
                  const discipline = disciplines.find(
                    (d) => d.fieldLabel === this.category
                  );
                  if (discipline && discipline.fieldId) {
                    window.location.href = `/personnel-enseignant/discipline/typologie/${discipline.fieldId}`;
                  }
                },
              },
            },
            states: {
              hover: {
                brightness: -0.1,
              },
              select: {
                color: "#a4edba",
                borderColor: "black",
                borderWidth: 2,
              },
            },
          },
        },
        series: [
          {
            name: "Non-Titulaires",
            data: nonTitulairesData,
            color: rootStyles.getPropertyValue("--purple-glycine-sun-319"),
            type: "bar",
          },
          {
            name: "Autres Titulaires",
            data: autresTitulairesData,
            color: rootStyles.getPropertyValue("--blue-cumulus-sun-368"),
            type: "bar",
          },
          {
            name: "Enseignants-Chercheurs",
            data: ecData,
            color: rootStyles.getPropertyValue("--pink-tuile-sun-425"),
            type: "bar",
          },
        ],
      };
    
    return CreateChartOptions("column", options);
}
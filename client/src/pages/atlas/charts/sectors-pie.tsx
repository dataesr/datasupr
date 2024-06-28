import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type SectorData = {
  name: string;
  y: number;
}[];

export default function SectortsChart({
  data = [],
  isLoading = false,
  currentYear,
}: {
  data: SectorData;
  isLoading: boolean;
  currentYear: string;
}) {
  if (isLoading || !data || !data.length) {
    return <div>Loader</div>;
  }
  const secteursOptions = {
    chart: {
      type: "pie",
      height: "80%",
    },
    title: {
      text:
        "Pourcentage d'étudiants inscrits regroupés par secteur pour l'année universitaire " +
        currentYear,
      align: "center",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: false,
            distance: 20,
          },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "1em",
              textOutline: "none",
              opacity: 0.7,
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        ],
      },
      pie: {
        colors: ["#748CC0", "#755F4D"],
      },
    },
    series: [
      {
        name: "Nombre d'étudiants",
        colorByPoint: true,
        data,
        showInLegend: true,
      },
    ],
  };

  return (
    <section>
      <HighchartsReact highcharts={Highcharts} options={secteursOptions} />
    </section>
  );
}

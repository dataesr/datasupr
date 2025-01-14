import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Template from "../../../../components/template";

type SectorData = {
  name: string;
  y: number;
}[];

export default function SectortsChart({
  data = [],
  isLoading = false,
}: {
  data: SectorData;
  isLoading: boolean;
}) {
  if (isLoading || !data || (data[0].y === 0 && data[1].y === 0)) {
    return <Template height="250px" />;
  }
  const rootStyles = getComputedStyle(document.documentElement);
  const secteursOptions = {
    chart: {
      type: "pie",
      height: "60%",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    legend: {
      itemStyle:{
        color: rootStyles.getPropertyValue("--label-color"),
        fontFamily: "Marianne, sans-serif",
      }
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

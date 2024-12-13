import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Template from "../../../components/template";

type DataProps = {
  label: string;
  effectif_PU: number;
  effectif_PR: number;
};

export default function FilieresSectorsChart({
  data,
  isLoading,
}: {
  data: DataProps[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Template />;
  }
  const rootStyles = getComputedStyle(document.documentElement);
  const filieresOptions = {
    chart: {
      backgroundColor: "transparent",
      type: "bar",
    },
    legend: {
      itemStyle:{
        color: rootStyles.getPropertyValue("--label-color"),
        fontFamily: "Marianne, sans-serif",
      }
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: data.map((filiere) => filiere.label),
      title: {
        text: "",
      },
      gridLineWidth: 0.5,
      lineWidth: 0,
      labels: {
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'étudiants",
        align: "high",
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
      },
      labels: {
        overflow: "justify",
        style: {
          color: rootStyles.getPropertyValue("--label-color"),
          fontFamily: "Marianne, sans-serif",
        },
      },
      gridLineWidth: 0,
    },
    tooltip: {
      valueSuffix: " étudiants",
    },
    plotOptions: {
      bar: {
        borderRadius: "20%",
        dataLabels: {
          enabled: true,
        },
        groupPadding: 0.1,
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Secteur public",
        data: data.map((filiere) =>
          filiere.effectif_PU ? filiere.effectif_PU : 0
        ),
        color: "#748CC0",
      },
      {
        name: "Secteur privé",
        data: data.map((filiere) =>
          filiere.effectif_PR ? filiere.effectif_PR : 0
        ),
        color: "#755F4D",
      },
    ],
  };
  return (
    <section>
      <HighchartsReact highcharts={Highcharts} options={filieresOptions} />
    </section>
  );
}

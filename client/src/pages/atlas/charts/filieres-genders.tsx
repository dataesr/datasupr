import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Template from "../../../components/template";

type DataProps = {
  label: string;
  effectif_masculin: number;
  effectif_feminin: number;
};

export default function FilieresGendersChart({
  data,
  isLoading,
}: {
  data: DataProps[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Template />;
  }
  const filieresOptions = {
    chart: {
      backgroundColor: "transparent",
      type: "bar",
      height: "600",
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
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre d'étudiants",
        align: "high",
      },
      labels: {
        overflow: "justify",
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
        name: "Masculin",
        data: data.map((filiere) =>
          filiere.effectif_masculin ? filiere.effectif_masculin : 0
        ),
        color: "#efcb3a",
      },
      {
        name: "Féminin",
        data: data.map((filiere) =>
          filiere.effectif_feminin ? filiere.effectif_feminin : 0
        ),
        color: "#e18b76",
      },
    ],
  };
  return (
    <section>
      <HighchartsReact highcharts={Highcharts} options={filieresOptions} />
    </section>
  );
}

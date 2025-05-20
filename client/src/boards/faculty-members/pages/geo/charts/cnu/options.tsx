import HighchartsInstance from "highcharts";
import Treemap from "highcharts/modules/treemap";
import Highcharts from "highcharts";

Treemap(Highcharts);

interface Subject {
  id: string;
  label_fr: string;
  headcount: number;
}

interface OptionsProps {
  subjects: Subject[];
}

const CreateChartOptions = (
  _p0: string,
  options: HighchartsInstance.Options
) => {
  return options;
};

const DISCIPLINE_COLORS = {
  D: "#3558a2", // Droit, économie et gestion - bleu professionnel
  L: "#6e445a", // Lettres et sciences humaines - violet
  S: "#2f4077", // Sciences - bleu foncé
  M: "#a94645", // Médecine - rouge médical
  G: "#ef8969", // Pharmacie et Autres Santé - rose saumon
  A: "#745b47", // Odontologie - marron
  O: "#006a6f", // Personnel des grands établissements - vert professionnel
  P: "#929292", // Non spécifiée - gris neutre
};

export default function Options({
  subjects,
}: OptionsProps): HighchartsInstance.Options | null {
  if (!subjects) return null;

  const data = subjects.map((subject) => {
    const disciplineCode = subject.id.substring(1, 2);

    return {
      name: subject.label_fr,
      value: subject.headcount,
      color: DISCIPLINE_COLORS[disciplineCode] || "#929292",
    };
  });
  const newOptions: HighchartsInstance.Options = {
    chart: {
      backgroundColor: "#f9f6f2",
    },
    colorAxis: {
      minColor: "#f4f6fe",
      maxColor: "#2f4077",
      labels: {
        style: {
          color: "#2f4077",
          fontFamily: "'Marianne', sans-serif",
        },
      },
    },
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        clip: false,
        data: data,
        dataLabels: {
          style: {
            color: "#ffffff",
            textOutline: "1px contrast",
            fontFamily: "'Marianne', sans-serif",
            fontSize: "12px",
          },
        },
        colorByPoint: false,
        colors: undefined,
      },
    ],
    title: {
      text: "Répartition par CNU",
      style: {
        color: "#2f4077",
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily: "'Marianne', sans-serif",
      },
    },
    tooltip: {
      backgroundColor: "#f4f6fe",
      borderColor: "#bfccfb",
      style: {
        color: "#2f4077",
        fontFamily: "'Marianne', sans-serif",
      },
      formatter: function () {
        const point = this.point as Highcharts.Point;
        return `<b>${point.name}</b><br/>
                Effectif : ${Highcharts.numberFormat(
                  point.value ?? 0,
                  0,
                  ",",
                  " "
                )} personnes`;
      },
    },
    credits: {
      enabled: false,
    },
  };

  return CreateChartOptions("treemap", newOptions);
}

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
  D: "#3558a2",
  L: "#6e445a",
  S: "#2f4077",
  M: "#a94645",
  G: "#ef8969",
  A: "#745b47",
  O: "#006a6f",
  P: "#929292",
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
      backgroundColor: "transparent",
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

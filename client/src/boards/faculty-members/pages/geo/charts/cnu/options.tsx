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

export default function Options({
  subjects,
}: OptionsProps): HighchartsInstance.Options | null {
  if (!subjects) return null;

  const data = subjects.map((subject) => ({
    name: subject.label_fr,
    value: subject.headcount,
    colorValue: subject.headcount,
  }));

  const newOptions: HighchartsInstance.Options = {
    colorAxis: {
      minColor: "#FFFFFF",
      maxColor: HighchartsInstance.getOptions()?.colors?.[0] || "#7cb5ec",
    },
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        clip: false,
        data: data,
      },
    ],
    title: {
      text: "Répartition par CNU",
    },
  };

  return CreateChartOptions("treemap", newOptions);
}

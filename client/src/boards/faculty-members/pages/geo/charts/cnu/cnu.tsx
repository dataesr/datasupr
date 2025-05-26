import ChartWrapper from "../../../../../../components/chart-wrapper";
import Options from "./options";

interface Subject {
  id: string;
  label_fr: string;
  headcount: number;
}

interface CNUPieChartProps {
  subjects: Subject[];
}

const CNUPieChart: React.FC<CNUPieChartProps> = ({ subjects }) => {
  const config = {
    id: "facultyMembersCNU",
    idQuery: "facultyMembersCNU",
    title: {
      fr: "Répartition par statut des enseignants par discipline",
      en: "Distribution of faculty members by status and discipline",
    },
    description: {
      fr: "Répartition des enseignants par statut et discipline",
      en: "Distribution of faculty members by status and discipline",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };
  const chartOptions = Options({ subjects: subjects });

  return chartOptions ? (
    <ChartWrapper
      config={config}
      options={chartOptions}
      legend={""}
      renderData={undefined}
    />
  ) : null;
};

export default CNUPieChart;

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { Subject } from "../../types";
import Options from "./options";

interface CNUPieChartProps {
  subjects: Subject[];
}

const CNUPieChart = ({ subjects }: CNUPieChartProps) => {
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
  const chartOptions = Options({ subjects });

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

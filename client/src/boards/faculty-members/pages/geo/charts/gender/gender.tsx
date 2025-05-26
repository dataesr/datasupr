import ChartWrapper from "../../../../../../components/chart-wrapper";
import options from "./options";

interface GenderPieChartProps {
  maleCount: number;
  femaleCount: number;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({
  maleCount,
  femaleCount,
}) => {
  const chartOptions = options({ maleCount, femaleCount });

  const config = {
    id: "facultyMembersGender",
    idQuery: "facultyMembersGender",
    title: {
      fr: "Professionnal Categories Distribution",
      en: "Distribution of gender among faculty members",
    },
    description: {
      fr: "Répartition des membres du personnel par sexe",
      en: "Distribution of faculty members by gender",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };

  return chartOptions ? (
    <ChartWrapper
      config={config}
      options={chartOptions}
      legend={null}
      renderData={() => null}
    />
  ) : null;
};

export default GenderPieChart;

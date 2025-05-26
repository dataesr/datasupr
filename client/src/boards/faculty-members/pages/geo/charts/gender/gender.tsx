import ChartWrapper from "../../../../../../components/chart-wrapper";
import { GenderDistributionProps } from "../../types";
import options from "./options";

const GenderPieChart = ({
  maleCount,
  femaleCount,
}: GenderDistributionProps) => {
  const chartOptions = options({ maleCount, femaleCount });

  const config = {
    id: "facultyMembersGender",
    idQuery: "facultyMembersGender",
    title: {
      fr: "Répartition par genre",
    },
    description: {
      fr: "Répartition des membres du personnel par sexe",
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

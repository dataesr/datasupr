import ChartWrapper from "../../../../../../../components/chart-wrapper";
import options from "./options";

interface StackStatusPerDisciplineBarProps {
  statusData: [];
  selectedYear: string;
}

const StackStatusPerDisciplineBar: React.FC<
  StackStatusPerDisciplineBarProps
> = ({ statusData, selectedYear }) => {
  const config = {
    id: "StackStatusPerDisciplineBar",
    idQuery: "StackStatusPerDisciplineBar",
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
  const chartOptions = options({ statusData, selectedYear });

  return chartOptions ? (
    <>
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={undefined}
      />
    </>
  ) : null;
};

export default StackStatusPerDisciplineBar;

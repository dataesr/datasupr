import ChartWrapper from "../../../../../components/chart-wrapper";
import options from "./options";

interface StackStatusPerDisciplineBarProps {
    statusData: [];
    selectedYear: string;
}

const StackStatusPerDisciplineBar: React.FC<StackStatusPerDisciplineBarProps> = ({
    statusData,
    selectedYear,
}) => {
  const chartOptions = options({ statusData, selectedYear });

  return chartOptions ? (
    <>
      <ChartWrapper
        id="StackStatusPerDisciplineBar"
        options={chartOptions}
        legend={null}
      />
    </>
  ) : null;
};

export default StackStatusPerDisciplineBar;
import ChartWrapper from "../../../../components/chart-wrapper";
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

  return chartOptions ? (
    <ChartWrapper
      id="facultyMembersGender"
      options={chartOptions}
      legend={null}
    />
  ) : null;
};

export default GenderPieChart;

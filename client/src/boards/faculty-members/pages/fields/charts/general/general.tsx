import ChartWrapper from "../../../../components/chart-wrapper";
import options from "./options";

interface FieldsDistributionTreemapProps {
  fieldsData: [];
  selectedYear: string;
}

const FieldsDistributionTreemap: React.FC<FieldsDistributionTreemapProps> = ({
  fieldsData,
  selectedYear,
}) => {
  const chartOptions = options({ fieldsData, selectedYear });

  return chartOptions ? (
    <ChartWrapper
      id="fieldsDistributionTreemap"
      options={chartOptions}
      legend={null}
    />
  ) : null;
};

export default FieldsDistributionTreemap;

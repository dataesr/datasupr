import { Link } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../components/chart-wrapper";
import options from "./options";

interface FieldsDistributionBarProps {
  fieldsData: [];
  selectedYear: string;
}

const FieldsDistributionBar: React.FC<FieldsDistributionBarProps> = ({
  fieldsData,
  selectedYear,
}) => {
  const chartOptions = options({ fieldsData, selectedYear });

  return chartOptions ? (
    <>
      <ChartWrapper
        id="FieldsDistributionBar"
        options={chartOptions}
        legend={null}
      />
      <i className="text-center">
        <Link href="/personnel-enseignant/discipline/typologie">
          En savoir plus sur la typologie des enseignants
        </Link>
      </i>
    </>
  ) : null;
};

export default FieldsDistributionBar;

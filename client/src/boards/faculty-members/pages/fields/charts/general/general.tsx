import { Link } from "@dataesr/dsfr-plus";
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
    <>
      <ChartWrapper
        id="fieldsDistributionTreemap"
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

export default FieldsDistributionTreemap;

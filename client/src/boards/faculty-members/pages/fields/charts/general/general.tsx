import { Link } from "@dataesr/dsfr-plus";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import useFacultyMembersByFields from "../../api/use-by-fields";

interface FieldsDistributionBarProps {
  selectedYear: string;
}

const FieldsDistributionBar: React.FC<FieldsDistributionBarProps> = ({
  selectedYear,
}) => {
  const { data: fieldsData } = useFacultyMembersByFields(selectedYear);

  const chartOptions = options({ fieldsData, selectedYear });

  const config = {
    id: "FieldsDistributionBar",
    idQuery: "FieldsDistributionBar",
    title: {
      fr: "Répartition par discipline des enseignants",
      en: "Distribution of faculty members by discipline",
    },
    description: {
      fr: "Répartition des enseignants par discipline",
      en: "Distribution of faculty members by discipline",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };

  return chartOptions ? (
    <>
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={undefined}
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

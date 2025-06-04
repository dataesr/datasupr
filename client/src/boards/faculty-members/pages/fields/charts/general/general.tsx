import { Link } from "@dataesr/dsfr-plus";
import options from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useFacultyMembersFieldsOverview } from "../../api/use-overview";
import { useSearchParams } from "react-router-dom";

const FieldsDistributionBar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("year") || "";

  const {
    data: overviewData,
    isLoading,
    error,
  } = useFacultyMembersFieldsOverview(selectedYear);

  const fieldsData =
    overviewData?.discipline_distribution?.map((discipline) => ({
      year: selectedYear,
      field_id: discipline._id.discipline_code,
      fieldLabel: discipline._id.discipline_name,
      totalCount: discipline.count,
      maleCount: 0,
      femaleCount: 0,
    })) || [];

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

  if (isLoading) {
    return <div>Chargement du graphique...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des données</div>;
  }

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

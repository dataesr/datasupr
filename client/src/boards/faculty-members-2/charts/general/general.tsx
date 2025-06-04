import { Link } from "@dataesr/dsfr-plus";
import options from "./options";
import ChartWrapper from "../../../../components/chart-wrapper";
import { useSearchParams } from "react-router-dom";
import { useFacultyMembersOverview } from "../../api/use-overview";
import { useContextDetection } from "../../utils";

const DistributionBar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("year") || "";
  const { context, contextId, contextName } = useContextDetection();

  const {
    data: overviewData,
    isLoading,
    error,
  } = useFacultyMembersOverview({
    context,
    year: selectedYear,
    contextId,
  });

  if (context === "fields" && contextId) {
    return null;
  }

  const itemsData = (() => {
    if (!overviewData || !overviewData.discipline_distribution) return [];

    return overviewData.discipline_distribution.map((item) => {
      const maleData = item.gender_breakdown?.find(
        (g) => g.gender === "Masculin"
      );
      const femaleData = item.gender_breakdown?.find(
        (g) => g.gender === "Féminin"
      );

      return {
        year: selectedYear,
        field_id: item._id.discipline_code,
        fieldLabel: item._id.discipline_name,
        totalCount: item.total_count,
        maleCount: maleData?.count || 0,
        femaleCount: femaleData?.count || 0,
      };
    });
  })();

  const chartOptions = options({ fieldsData: itemsData, selectedYear });

  const getTitle = () => {
    switch (context) {
      case "fields":
        return "Répartition par discipline des enseignants";
      case "geo":
        return contextId
          ? `Répartition par discipline des enseignants pour la région ${contextName}`
          : "Répartition par discipline des enseignants par région";
      case "structures":
        return contextId
          ? `Répartition par discipline des enseignants pour l'établissement ${contextName}`
          : "Répartition par discipline des enseignants par établissement";
      default:
        return "Répartition par discipline des enseignants";
    }
  };

  const config = {
    id: "DistributionBar",
    idQuery: "DistributionBar",
    title: {
      fr: getTitle(),
    },
    description: {
      fr: getTitle(),
    },
    integrationURL: "/personnel-enseignant/discipline/typologie",
  };

  if (isLoading) {
    return <div>Chargement du graphique...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des données</div>;
  }

  if (!itemsData || itemsData.length === 0) {
    return <div>Aucune donnée disponible pour l'année {selectedYear}</div>;
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

export default DistributionBar;

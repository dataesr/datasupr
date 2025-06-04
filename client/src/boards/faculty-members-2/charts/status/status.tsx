import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import StatusOptions from "./options";
import ChartWrapper from "../../../../components/chart-wrapper";
import { useFacultyMembersOverview } from "../../api/use-overview";
import { useContextDetection, generateIntegrationURL } from "../../utils";

interface StatusData {
  fieldLabel: string;
  totalCount: number;
  nonTitulaires: number;
  titulairesNonChercheurs: number;
  enseignantsChercheurs: number;
  totalTitulaires: number;
}

const StatusDistribution: React.FC = () => {
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

  const config = {
    id: "statusDistribution",
    idQuery: "statusDistribution",
    title: {
      fr: contextId
        ? `Répartition par statut - ${contextName} sélectionnée`
        : "Répartition par statut des enseignants",
    },
    description: {
      fr: contextId
        ? `Répartition des enseignants par statut pour ${
            contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"
          } ${contextName} sélectionnée`
        : "Répartition des enseignants par statut (Non-titulaires, Titulaires non-chercheurs, Enseignants-chercheurs)",
    },
    integrationURL: generateIntegrationURL(context, "statuts"),
  };

  const processedData = useMemo(() => {
    if (!overviewData) return [];

    let statusDistribution;
    switch (context) {
      case "fields":
        statusDistribution = overviewData.disciplineStatusDistribution;
        break;
      case "geo":
        statusDistribution = overviewData.regionStatusDistribution;
        break;
      case "structures":
        statusDistribution = overviewData.structureStatusDistribution;
        break;
      default:
        return [];
    }

    if (!statusDistribution) return [];

    const statusData: StatusData[] = statusDistribution.map((item) => {
      let itemName;
      switch (context) {
        case "fields":
          itemName = item._id.discipline_name;
          break;
        case "geo":
          itemName = item._id.geo_name;
          break;
        case "structures":
          itemName = item._id.structure_name;
          break;
        default:
          itemName = "Unknown";
      }

      const totalCount = item.total_count;
      let enseignantsChercheurs = 0;
      let titulairesNonChercheurs = 0;
      let nonTitulaires = 0;

      item.status_breakdown?.forEach((status) => {
        switch (status.status) {
          case "enseignant_chercheur":
            enseignantsChercheurs = status.count;
            break;
          case "titulaire_non_chercheur":
            titulairesNonChercheurs = status.count;
            break;
          case "non_titulaire":
            nonTitulaires = status.count;
            break;
        }
      });

      const totalTitulaires = enseignantsChercheurs + titulairesNonChercheurs;

      return {
        fieldLabel: itemName,
        totalCount,
        nonTitulaires,
        titulairesNonChercheurs,
        enseignantsChercheurs,
        totalTitulaires,
      };
    });

    return statusData
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, contextId ? statusData.length : 8);
  }, [overviewData, context, contextId]);

  const chartData = useMemo(() => {
    return processedData.map((item) => ({
      ...item,
      series: [
        {
          name: "Non-titulaires",
          value: item.nonTitulaires,
          color: "#FF6B6B",
        },
        {
          name: "Titulaires ",
          value: item.titulairesNonChercheurs,
          color: "#4ECDC4",
        },
        {
          name: "Enseignants-chercheurs",
          value: item.enseignantsChercheurs,
          color: "#45B7D1",
        },
      ],
    }));
  }, [processedData]);

  const chartOptions = StatusOptions({
    disciplines: chartData,
  });

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des données par statut...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-text--center fr-py-3w fr-text--red">
        Erreur lors du chargement des données par statut
      </div>
    );
  }

  if (!overviewData || processedData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour les statuts pour l'année {selectedYear}
        {contextId &&
          ` et ${
            contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"
          } ${contextName} sélectionnée`}
      </div>
    );
  }

  const getDisplayLimit = () => {
    const labels = {
      fields: "disciplines",
      geo: "régions",
      structures: "établissements",
    };
    return labels[context];
  };

  return (
    <div>
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={undefined}
      />
      <div className="fr-text--xs fr-text--italic fr-mt-1w">
        <strong>Légende :</strong>
        <br />
        <span style={{ color: "#FF6B6B" }}>■</span> Non-titulaires |{" "}
        <span style={{ color: "#4ECDC4" }}>■</span> Titulaires non-chercheurs |{" "}
        <span style={{ color: "#45B7D1" }}>■</span> Enseignants-chercheurs
        <br />
        {contextId ? (
          <>
            Données de statut pour{" "}
            {contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"}{" "}
            {contextName} sélectionnée.
          </>
        ) : (
          <>
            Affichage des 8 principales {getDisplayLimit()} par effectif total.
          </>
        )}
      </div>
    </div>
  );
};

export default StatusDistribution;

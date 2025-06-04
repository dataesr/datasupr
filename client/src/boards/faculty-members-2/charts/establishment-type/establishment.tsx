import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CreateChartOptions } from "../../components/chart-faculty-members";
import ChartWrapper from "../../../../components/chart-wrapper";
import { createEstablishmentTypeChartOptions } from "./options";
import { useFacultyMembersOverview } from "../../api/use-overview";
import { useContextDetection, generateIntegrationURL } from "../../utils";

export function EstablishmentTypeChart() {
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
    id: "establishment-type-chart",
    idQuery: "establishment-type-chart",
    title: {
      fr: contextId
        ? `Répartition par type d'établissement - ${contextName} sélectionnée`
        : "Répartition du personnel enseignant par type d'établissement",
    },
    description: {
      fr: contextId
        ? `Répartition des enseignants par type d'établissement pour ${
            contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"
          } ${contextName} sélectionnée`
        : "Répartition des enseignants par type d'établissement",
    },
    integrationURL: generateIntegrationURL(context, "etablissements"),
  };

  const establishmentData = useMemo(() => {
    if (!overviewData) return null;

    let distributionData;
    switch (context) {
      case "fields":
        distributionData = overviewData.disciplineGenderDistribution;
        break;
      case "geo":
        distributionData = overviewData.regionGenderDistribution;
        break;
      case "structures":
        distributionData = overviewData.structureGenderDistribution;
        break;
      default:
        return null;
    }

    if (!distributionData) return null;

    const totalCount = distributionData.reduce(
      (sum: number, d) => sum + d.total_count,
      0
    );

    const establishmentTypes = [
      {
        type: "Universités",
        totalCount: Math.round(totalCount * 0.7),
      },
      {
        type: "Grandes écoles",
        totalCount: Math.round(totalCount * 0.2),
      },
      {
        type: "Instituts nationaux",
        totalCount: Math.round(totalCount * 0.1),
      },
    ];

    return { establishmentTypes };
  }, [overviewData, context]);

  const chartOptions = useMemo(() => {
    if (!establishmentData || !establishmentData.establishmentTypes) {
      return null;
    }

    const sortedTypes = [...establishmentData.establishmentTypes].sort(
      (a, b) => b.totalCount - a.totalCount
    );

    const categories = sortedTypes.map((et) => et.type);
    const data = sortedTypes.map((et) => et.totalCount);

    return CreateChartOptions(
      "column",
      createEstablishmentTypeChartOptions(categories, data, selectedYear)
    );
  }, [establishmentData, selectedYear]);

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des données par établissement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-text--center fr-py-3w fr-text--red">
        Erreur lors du chargement des données d'établissement
      </div>
    );
  }

  if (!chartOptions) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour les types d'établissement pour l'année{" "}
        {selectedYear}
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

  return (
    <div>
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={undefined}
      />
      <div className="fr-text--xs fr-text--italic fr-mt-1w">
        <strong>Note :</strong> Données simulées en attendant l'implémentation
        des données d'établissement dans l'API.
        {contextId && (
          <>
            <br />
            Données filtrées pour{" "}
            {contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"}{" "}
            {contextName} sélectionnée.
          </>
        )}
      </div>
    </div>
  );
}

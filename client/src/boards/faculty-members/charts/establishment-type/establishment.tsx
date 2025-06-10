import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CreateChartOptions } from "../../components/chart-faculty-members";
import ChartWrapper from "../../../../components/chart-wrapper";
import { createEstablishmentTypeChartOptions } from "./options";
import { useFacultyMembersOverview } from "../../api/use-overview";
import { useContextDetection, generateIntegrationURL } from "../../utils";

export function EstablishmentTypeChart() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId, contextName } = useContextDetection();

  const {
    data: overviewData,
    isLoading,
    error,
  } = useFacultyMembersOverview({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const config = {
    id: "establishment-type-chart",
    idQuery: "faculty-members-overview",
    title: `Répartition par type d'établissement - ${contextName} sélectionnée`,
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
    if (!overviewData?.establishmentTypeDistribution) {
      return null;
    }

    const establishmentTypes = overviewData.establishmentTypeDistribution.map(
      (item) => ({
        type: item._id || "Non précisé",
        totalCount: item.total_count,
        genderBreakdown: item.gender_breakdown,
      })
    );

    return { establishmentTypes };
  }, [overviewData]);

  const chartOptions = useMemo(() => {
    if (!establishmentData?.establishmentTypes) {
      return null;
    }

    const validTypes = establishmentData.establishmentTypes.filter(
      (et) => et.totalCount > 0
    );

    if (validTypes.length === 0) {
      return null;
    }

    const categories = validTypes.map((et) => et.type);
    const data = validTypes.map((et) => et.totalCount);

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
        Erreur lors du chargement des données d'établissement : {error.message}
      </div>
    );
  }

  if (!chartOptions || !establishmentData?.establishmentTypes) {
    return (
      <div className="fr-text--center fr-py-3w">
        <p>Aucune donnée disponible pour les types d'établissement</p>
        {selectedYear && <p>Année : {selectedYear}</p>}
        {contextId && <p>Contexte : {contextName} sélectionnée</p>}
        <details className="fr-mt-2w">
          <summary>Détails de debug</summary>
          <pre className="fr-text--xs">
            {JSON.stringify(
              {
                hasOverviewData: !!overviewData,
                hasEstablishmentData:
                  !!overviewData?.establishmentTypeDistribution,
                establishmentDataLength:
                  overviewData?.establishmentTypeDistribution?.length || 0,
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div>
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={establishmentData.establishmentTypes}
      />
    </div>
  );
}

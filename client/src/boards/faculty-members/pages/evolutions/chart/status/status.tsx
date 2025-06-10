import { useMemo } from "react";
import { useContextDetection } from "../../../../utils";
import { useFacultyMembersEvolution } from "../../../../api/use-evolution";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createStatusEvolutionOptions } from "./options";

export function StatusEvolutionChart() {
  const { context, contextId, contextName } = useContextDetection();

  const {
    data: evolutionData,
    isLoading,
    error,
  } = useFacultyMembersEvolution({
    context,
    contextId,
  });

  const { processedData, chartOptions } = useMemo(() => {
    if (!evolutionData?.status_evolution || !evolutionData?.years) {
      return { processedData: [], chartOptions: null };
    }

    const yearlyData = evolutionData.status_evolution.map((yearData) => {
      const result: Record<string, string | number> = { year: yearData._id };

      yearData.status_breakdown.forEach((status) => {
        result[status.status] = status.count;
      });

      return result;
    });

    yearlyData.sort((a, b) => a.year.localeCompare(b.year));

    const statusData = {
      enseignant_chercheur: yearlyData.map(
        (data) => data.enseignant_chercheur || 0
      ),
      titulaire_non_chercheur: yearlyData.map(
        (data) => data.titulaire_non_chercheur || 0
      ),
      non_titulaire: yearlyData.map((data) => data.non_titulaire || 0),
    };

    const contextTypeMap = {
      fields: "discipline",
      geo: "région",
      structures: "établissement",
    } as const;

    const options = createStatusEvolutionOptions({
      years: evolutionData.years,
      statusData,
      contextName: evolutionData.context_info?.name || contextName,
      contextType: contextTypeMap[context],
    });

    return {
      processedData: yearlyData,
      chartOptions: options,
    };
  }, [evolutionData, context, contextName]);

  const config = {
    id: "status-evolution-chart",
    idQuery: "faculty-members-evolution",
    title: {
      fr: contextName
        ? `Évolution par statut - ${contextName}`
        : "Évolution des effectifs par statut professionnel",
      en: contextName
        ? `Status evolution - ${contextName}`
        : "Faculty status evolution",
    },
    description: {
      fr: contextName
        ? `Évolution de la répartition par statut professionnel pour ${contextName} au fil des années`
        : "Évolution de la répartition par statut professionnel du personnel enseignant",
      en: contextName
        ? `Professional status distribution evolution for ${contextName} over the years`
        : "Faculty professional status distribution evolution over time",
    },
  };

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-5w">
        <span
          className="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
          aria-hidden="true"
        ></span>
        <p className="fr-mt-2w">
          Chargement des données d'évolution de statut...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-alert fr-alert--error fr-my-3w">
        <p>Erreur lors du chargement des données : {error.message}</p>
      </div>
    );
  }

  if (!chartOptions || processedData.length === 0) {
    return (
      <div className="fr-alert fr-alert--info fr-my-3w">
        <p>
          Aucune donnée d'évolution de statut disponible pour cette période.
        </p>
      </div>
    );
  }

  return (
    <div className="status-evolution-chart">
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={processedData}
      />
    </div>
  );
}

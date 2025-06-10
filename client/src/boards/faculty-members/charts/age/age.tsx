import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ChartWrapper from "../../../../components/chart-wrapper";
import { createAgeDistributionChartOptions } from "./options";
import { useFacultyMembersOverview } from "../../api/use-overview";
import {
  generateContextualTitle,
  generateIntegrationURL,
  useContextDetection,
} from "../../utils";

export function AgeDistributionPieChart() {
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
    id: "age-distribution-chart",
    idQuery: "faculty-members-overview",
    title: {
      fr: contextId
        ? `Répartition par âge - ${contextName} sélectionnée`
        : "Répartition par âge des enseignants",
      en: contextId
        ? `Age distribution for selected ${contextName}`
        : "Age distribution of faculty members",
    },
    description: {
      fr: contextId
        ? `Répartition des enseignants par classe d'âge pour ${
            contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"
          } ${contextName} sélectionnée`
        : "Répartition des enseignants par classe d'âge",
      en: contextId
        ? `Distribution of faculty members by age group for selected ${contextName}`
        : "Distribution of faculty members by age group",
    },
    integrationURL: generateIntegrationURL(context, "age"),
  };

  const processedData = useMemo(() => {
    if (!overviewData?.age_distribution) return null;

    const ageDistribution = overviewData.age_distribution;

    let totalCount = 0;
    ageDistribution.forEach((ageData) => {
      if (ageData._id !== "Non précisé") {
        totalCount += ageData.count;
      }
    });

    const chartData = ageDistribution
      .filter((ageData) => ageData._id !== "Non précisé")
      .map((ageData) => ({
        name: ageData._id,
        y:
          totalCount > 0
            ? Math.round((ageData.count / totalCount) * 100 * 10) / 10
            : 0,
        count: ageData.count,
      }));

    const chartTitle = generateContextualTitle(
      "Répartition par âge",
      context,
      contextId,
      overviewData.context_info?.name
    );

    return {
      chartData,
      title: chartTitle,
      totalCount,
      isSpecific: !!contextId,
      contextName: overviewData.context_info?.name || contextName,
    };
  }, [overviewData, contextId, context, contextName]);

  const chartOptions = useMemo(() => {
    if (!processedData) return null;

    return createAgeDistributionChartOptions(
      processedData.chartData,
      processedData.title,
      selectedYear,
      processedData.isSpecific
    );
  }, [processedData, selectedYear]);

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des données de répartition par âge...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-text--center fr-py-3w fr-text--red">
        Erreur lors du chargement des données par âge
      </div>
    );
  }

  if (!chartOptions || !processedData) {
    const getEmptyMessage = () => {
      let message = `Aucune donnée disponible pour la répartition par âge pour l'année ${selectedYear}`;

      if (contextId) {
        if (processedData?.contextName) {
          message += ` et ${processedData.contextName}`;
        } else {
          message += ` et ${
            contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"
          } ${contextName} sélectionnée`;
        }
      }

      return message;
    };

    return <div className="fr-text--center fr-py-3w">{getEmptyMessage()}</div>;
  }

  const getFooterMessage = () => {
    let message = `Total: ${processedData.totalCount.toLocaleString()} enseignants`;

    if (contextId && processedData.contextName) {
      message += ` pour ${processedData.contextName}`;
    } else if (contextId) {
      message += ` pour ${
        contextName === "discipline"
          ? "la"
          : contextName === "région"
          ? "la"
          : "l'"
      } ${contextName} sélectionnée`;
    }

    return message;
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
        {getFooterMessage()}
        <br />
        <small>Note: Les données "Non précisé" sont exclues du graphique</small>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { generateIntegrationURL, useContextDetection } from "../../../../utils";
import { createCategoryEvolutionOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useCategoryEvolution } from "./use-evolution";

export const CategoryEvolutionChart = () => {
  const { context, contextId, contextName } = useContextDetection();

  const {
    data: evolutionData,
    isLoading,
    error,
  } = useCategoryEvolution({
    context,
    contextId,
  });

  const chartOptions = useMemo(() => {
    if (!evolutionData?.evolutionByCategories || !evolutionData.academicYears)
      return null;

    const title = `Évolution du nombre d'enseignants par catégorie pour ${
      contextName || "le contexte actuel"
    }`;

    return createCategoryEvolutionOptions(
      evolutionData.evolutionByCategories,
      evolutionData.academicYears,
      title
    );
  }, [evolutionData, contextName]);

  if (isLoading) {
    return <DefaultSkeleton />;
  }

  if (error) {
    return (
      <div className="fr-text--center fr-py-3w fr-text--red">
        Erreur lors du chargement des données d'évolution par catégorie.
      </div>
    );
  }

  if (!chartOptions) {
    const getEmptyMessage = () => {
      let message = `Aucune donnée d'évolution par catégorie disponible.`;
      if (contextId) {
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
    return <div className="fr-text--center fr-py-3w">{getEmptyMessage()}</div>;
  }

  return (
    <ChartWrapper
      config={{
        id: "category-evolution-chart",
        idQuery: "category-evolution",
        title: {
          fr: chartOptions.title?.text as string,
        },
        description: {
          fr: `Ce graphique montre l'évolution du nombre d'enseignants-chercheurs par catégorie au fil des années universitaires.`,
        },
        integrationURL: generateIntegrationURL(context, "category-evolution"),
      }}
      legend={null}
      options={chartOptions}
    />
  );
};

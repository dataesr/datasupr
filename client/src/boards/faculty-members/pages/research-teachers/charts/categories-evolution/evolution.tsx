import { useMemo } from "react";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { generateIntegrationURL, useContextDetection } from "../../../../utils";
import { createCategoryEvolutionOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useCategoryEvolution } from "./use-evolution";
import SubtitleWithContext from "../../../../components/subtitle-with-context";

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

  const exampleCategory = useMemo(() => {
    if (
      !evolutionData?.evolutionByCategories ||
      evolutionData.evolutionByCategories.length === 0
    ) {
      return null;
    }

    const sortedCategories = [...evolutionData.evolutionByCategories].sort(
      (a, b) => {
        const lastA = Number(a.data[a.data.length - 1]?.y) || 0;
        const lastB = Number(b.data[b.data.length - 1]?.y) || 0;
        return lastB - lastA;
      }
    );

    const largestCategory = sortedCategories[0];
    if (!largestCategory || largestCategory.data.length === 0) {
      return null;
    }

    const startYear = evolutionData.academicYears[0];
    const endYear =
      evolutionData.academicYears[evolutionData.academicYears.length - 1];
    const startValue = largestCategory.data[0]?.y;
    const endValue = largestCategory.data[largestCategory.data.length - 1]?.y;

    if (startValue === undefined || endValue === undefined) {
      return null;
    }

    return {
      name: largestCategory.name,
      startYear,
      endYear,
      startValue,
      endValue,
    };
  }, [evolutionData]);

  const chartOptions = useMemo(() => {
    if (!evolutionData?.evolutionByCategories || !evolutionData.academicYears)
      return null;

    return createCategoryEvolutionOptions(
      evolutionData.evolutionByCategories,
      evolutionData.academicYears
    );
  }, [evolutionData]);

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
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: (
            <>
              Évolution du nombre d'enseignants parmanents par catégorie&nbsp;
              <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
            </>
          ),
        },
        comment: {
          fr: (
            <>
              Ce graphique montre l'évolution du nombre d'enseignants permanents
              par catégorie au fil des années universitaires.
            </>
          ),
        },
        readingKey: {
          fr: exampleCategory ? (
            <>
              Pour la catégorie <strong>"{exampleCategory.name}"</strong>,
              l'effectif est passé de{" "}
              <strong>
                {exampleCategory.startValue.toLocaleString("fr-FR")}
              </strong>{" "}
              pour l'année universitaire {exampleCategory.startYear} à{" "}
              <strong>
                {exampleCategory.endValue.toLocaleString("fr-FR")}
              </strong>{" "}
              pour {exampleCategory.endYear}.
            </>
          ) : (
            <></>
          ),
        },
        source: {
          label: {
            fr: <>MESR-SIES, SISE</>,
            en: <>MESR-SIES, SISE</>,
          },
          url: {
            fr: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
            en: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
          },
        },
        updateDate: new Date(),
        integrationURL: generateIntegrationURL(context, "category-evolution"),
      }}
      legend={null}
      options={chartOptions}
    />
  );
};

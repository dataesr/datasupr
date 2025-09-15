import { useMemo } from "react";
import { useContextDetection } from "../../../../utils";
import { useFacultyMembersEvolution } from "../../../../api/use-evolution";
import { createAgeEvolutionOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import SubtitleWithContext from "../../../../components/subtitle-with-context";
import { GlossaryTerm } from "../../../../components/glossary/glossary-tooltip";

function RenderData({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }} className="fr-mt-3w">
      <table
        className="fr-table fr-table--bordered fr-table--sm"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>Année</th>
            <th>Effectif total</th>
            <th>35 ans et moins</th>
            <th>36 à 55 ans</th>
            <th>56 ans et plus</th>
            <th>Non précisé</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.year}</td>
              <td>{item.totalCount.toLocaleString()}</td>
              <td>{item["35 ans et moins"].toFixed(1)}&nbsp;%</td>
              <td>{item["36 à 55 ans"].toFixed(1)}&nbsp;%</td>
              <td>{item["56 ans et plus"].toFixed(1)}&nbsp;%</td>
              <td>{item["Non précisé"].toFixed(1)}&nbsp;%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AgeEvolutionChart() {
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
    if (!evolutionData?.age_evolution || !evolutionData?.years) {
      return { processedData: null, chartOptions: null };
    }

    const ageClasses = [
      "35 ans et moins",
      "36 à 55 ans",
      "56 ans et plus",
      "Non précisé",
    ];

    const yearlyData = evolutionData.years
      .map((year) => {
        const yearData = evolutionData.age_evolution.find(
          (item) => item._id === year
        );

        const totalCount = yearData.age_breakdown.reduce(
          (sum, age) => sum + age.count,
          0
        );

        const agePercentages: Record<string, number> = {};

        ageClasses.forEach((ageClass) => {
          const ageBreakdown = yearData.age_breakdown.find(
            (age) => age.age_class === ageClass
          );
          const count = ageBreakdown?.count || 0;
          agePercentages[ageClass] =
            totalCount > 0 ? (count / totalCount) * 100 : 0;
        });

        return {
          year,
          totalCount,
          ...agePercentages,
        };
      })
      .filter(Boolean);

    if (yearlyData.length === 0) {
      return { processedData: null, chartOptions: null };
    }

    const ageData: Record<string, number[]> = {};

    ageClasses.forEach((ageClass) => {
      ageData[ageClass] = yearlyData.map((data) => data?.[ageClass] || 0);
    });

    const contextTypeMap = {
      fields: "discipline",
      geo: "région",
      structures: "établissement",
    } as const;

    const options = createAgeEvolutionOptions({
      years: evolutionData.years,
      ageData,
      contextName: evolutionData.context_info?.name || contextName,
      contextType: contextTypeMap[context],
    });

    return {
      processedData: yearlyData,
      chartOptions: options,
    };
  }, [evolutionData, context, contextName]);

  const config = {
    id: "age-evolution-chart",
    idQuery: "faculty-members-evolution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h3" as const,
      fr: (
        <>
          Evolution par âge&nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    comment: {
      fr: (
        <>
          Le <GlossaryTerm term="personnel enseignant" /> rajeunit-il ou
          vieillit-il ? Ce graphique suit l'évolution de la part de chaque
          tranche d'âge au fil des ans. Chaque couleur représente une génération
          : les plus jeunes (35 ans et moins), la génération intermédiaire (36 à
          55 ans) et les plus expérimentés (56 ans et plus).
        </>
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
  };

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-5w">
        <DefaultSkeleton />
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

  if (!chartOptions || !processedData) {
    return (
      <div className="fr-alert fr-alert--info fr-my-3w">
        <p>Aucune donnée d'évolution par âge disponible pour cette période.</p>
        <details className="fr-mt-2w">
          <summary>Détails de debug</summary>
          <pre className="fr-text--xs">
            {JSON.stringify(
              {
                hasEvolutionData: !!evolutionData,
                hasAgeEvolution: !!evolutionData?.age_evolution,
                hasYears: !!evolutionData?.years,
                yearsCount: evolutionData?.years?.length || 0,
                ageEvolutionCount: evolutionData?.age_evolution?.length || 0,
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
    <div className="age-evolution-chart">
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={processedData} />}
      />
    </div>
  );
}

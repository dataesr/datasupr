import { useMemo } from "react";
import {
  generateContextualTitle,
  useContextDetection,
} from "../../../../utils";
import { useFacultyMembersEvolution } from "../../../../api/use-evolution";
import { createAgeEvolutionOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

function RenderData({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table--sm fr-table fr-table--bordered fr-mt-3w">
      <table className="fr-table">
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
              <td>{item["35 ans et moins"].toFixed(1)}%</td>
              <td>{item["36 à 55 ans"].toFixed(1)}%</td>
              <td>{item["56 ans et plus"].toFixed(1)}%</td>
              <td>{item["Non précisé"].toFixed(1)}%</td>
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

  const chartTitle = generateContextualTitle(
    null,
    context,
    contextId,
    evolutionData,
    isLoading
  );

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
      fr: contextName
        ? `Évolution par âge - ${chartTitle}`
        : "Évolution de la répartition par âge",
    },
    description: {
      fr: contextName
        ? `Évolution de la pyramide des âges pour ${contextName} au fil des années`
        : "Évolution de la pyramide des âges du personnel enseignant",
    },
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

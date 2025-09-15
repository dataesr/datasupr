import { useMemo } from "react";
import { useContextDetection } from "../../../../utils";
import { useFacultyMembersEvolution } from "../../../../api/use-evolution";
import { createTrendsOptions } from "./options";
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
            <th>Hommes</th>
            <th>Femmes</th>
            <th>% Hommes</th>
            <th>% Femmes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const malePercent =
              item.total > 0
                ? ((item.male / item.total) * 100).toFixed(1)
                : "0.0";
            const femalePercent =
              item.total > 0
                ? ((item.female / item.total) * 100).toFixed(1)
                : "0.0";

            return (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{item.total.toLocaleString()}</td>
                <td>{item.male.toLocaleString()}</td>
                <td>{item.female.toLocaleString()}</td>
                <td>{malePercent}&nbsp;%</td>
                <td>{femalePercent}&nbsp;%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function TrendsChart() {
  const { context, contextId, contextName } = useContextDetection();

  const {
    data: evolutionData,
    isLoading,
    error,
  } = useFacultyMembersEvolution({
    context,
    contextId,
  });

  const { chartData, chartOptions } = useMemo(() => {
    if (!evolutionData?.global_evolution || !evolutionData?.years) {
      return { chartData: [], chartOptions: null };
    }

    const processedData = evolutionData.global_evolution.map((yearData) => ({
      year: yearData._id,
      total: yearData.total_count,
      male:
        yearData.gender_breakdown.find((g) => g.gender === "Masculin")?.count ||
        0,
      female:
        yearData.gender_breakdown.find((g) => g.gender === "Féminin")?.count ||
        0,
    }));

    processedData.sort((a, b) => a.year.localeCompare(b.year));

    const contextTypeMap = {
      fields: "discipline",
      geo: "région",
      structures: "établissement",
    } as const;

    const options = createTrendsOptions({
      years: evolutionData.years,
      chartData: processedData,
      contextName: evolutionData.context_info?.name || contextName,
      contextType: contextTypeMap[context],
    });

    return {
      chartData: processedData,
      chartOptions: options,
    };
  }, [evolutionData, context, contextName]);

  const config = {
    id: "trends-evolution-chart",
    idQuery: "faculty-members-evolution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h3" as const,
      fr: (
        <>
          Evolution des effectifs&nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
      comment: {
      fr: (
        <>
          Ce graphique présente deux indicateurs clés sur l'évolution du{" "}
          <GlossaryTerm term="personnel enseignant" /> : la croissance de
          l'effectif total et l'évolution de la{" "}
          <GlossaryTerm term="parité" />. Observez la tendance de l'effectif
          global et voyez comment la proportion d'hommes et de femmes a changé
          au fil des ans.
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

  if (!chartOptions || chartData.length === 0) {
    return (
      <div className="fr-alert fr-alert--info fr-my-3w">
        <p>Aucune donnée d'évolution disponible pour cette période.</p>
      </div>
    );
  }

  return (
    <div className="trends-evolution-chart">
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={chartData} />}
      />
    </div>
  );
}

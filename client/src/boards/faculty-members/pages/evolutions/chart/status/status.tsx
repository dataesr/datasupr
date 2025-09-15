import { useMemo } from "react";
import { useContextDetection } from "../../../../utils";
import { useFacultyMembersEvolution } from "../../../../api/use-evolution";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createStatusEvolutionOptions } from "./options";
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
            <th>Enseignants-chercheurs</th>
            <th>Titulaires non-chercheurs</th>
            <th>Non-permanents</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const total =
              (item.enseignant_chercheur || 0) +
              (item.titulaire_non_chercheur || 0) +
              (item.non_titulaire || 0);

            return (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{(item.enseignant_chercheur || 0).toLocaleString()}</td>
                <td>{(item.titulaire_non_chercheur || 0).toLocaleString()}</td>
                <td>{(item.non_titulaire || 0).toLocaleString()}</td>
                <td>{total.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

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
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h3" as const,
      fr: (
        <>
          Evolution par statut&nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    comment: {
      fr: (
        <>
          Évolution des effectifs du{" "}
          <GlossaryTerm term="personnel enseignant" /> selon trois grandes
          catégories de statut : les{" "}
          <GlossaryTerm term="enseignant-chercheur">
            enseignants-chercheurs
          </GlossaryTerm>
          , les{" "}
          <GlossaryTerm term="titulaires non-chercheurs">
            titulaires non-chercheurs
          </GlossaryTerm>{" "}
          (qui regroupent principalement les{" "}
          <GlossaryTerm term="enseignant du second degré, arts et métiers">
            enseignants du 2nd degré
          </GlossaryTerm>{" "}
          et les professeurs des Arts et Métiers), et les{" "}
          <GlossaryTerm term="permanent / non permanent">
            non-permanents
          </GlossaryTerm>
          .
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
        renderData={() => <RenderData data={processedData} />}
      />
    </div>
  );
}

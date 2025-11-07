import { useMemo, useState } from "react";
import { useContextDetection } from "../../../../utils";
import { useFacultyMembersEvolution } from "../../../../api/use-evolution";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createStatusEvolutionOptions } from "./options";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import SubtitleWithContext from "../../../../components/subtitle-with-context";
import { GlossaryTerm } from "../../../../components/glossary/glossary-tooltip";
import { Button } from "@dataesr/dsfr-plus";

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
            <th>Enseignant du Secondaire Affecté dans le Supérieur</th>
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
  const [permanentCategory, setPermanentCategory] = useState<
    | "all"
    | "professeurs"
    | "maitres_conferences"
    | "enseignants_2nd_degre"
    | "non_permanents"
  >("all");

  const { data: allData } = useFacultyMembersEvolution({
    context,
    contextId,
  });

  const {
    data: evolutionData,
    isLoading,
    error,
  } = useFacultyMembersEvolution({
    context,
    contextId,
    permanent_category:
      permanentCategory !== "all" ? permanentCategory : undefined,
  });

  const { data: professeursData } = useFacultyMembersEvolution({
    context,
    contextId,
    permanent_category: "professeurs",
  });

  const { data: maitresData } = useFacultyMembersEvolution({
    context,
    contextId,
    permanent_category: "maitres_conferences",
  });

  const { data: enseignants2ndData } = useFacultyMembersEvolution({
    context,
    contextId,
    permanent_category: "enseignants_2nd_degre",
  });

  const hasProfesseurs = useMemo(() => {
    return (
      professeursData?.status_evolution &&
      professeursData.status_evolution.length > 0 &&
      professeursData.status_evolution.some((y) =>
        y.status_breakdown.some((s) => s.count > 0)
      )
    );
  }, [professeursData]);

  const hasMaitres = useMemo(() => {
    return (
      maitresData?.status_evolution &&
      maitresData.status_evolution.length > 0 &&
      maitresData.status_evolution.some((y) =>
        y.status_breakdown.some((s) => s.count > 0)
      )
    );
  }, [maitresData]);

  const hasEnseignants2nd = useMemo(() => {
    return (
      enseignants2ndData?.status_evolution &&
      enseignants2ndData.status_evolution.length > 0 &&
      enseignants2ndData.status_evolution.some((y) =>
        y.status_breakdown.some((s) => s.count > 0)
      )
    );
  }, [enseignants2ndData]);

  const hasNonPermanents = useMemo(() => {
    return (
      allData?.status_evolution &&
      allData.status_evolution.length > 0 &&
      allData.status_evolution.some((yearData) =>
        yearData.status_breakdown.some(
          (s) => s.status === "non_titulaire" && s.count > 0
        )
      )
    );
  }, [allData]);

  const availableCategoryCount = useMemo(() => {
    let count = 0;
    if (hasProfesseurs) count++;
    if (hasMaitres) count++;
    if (hasEnseignants2nd) count++;
    if (hasNonPermanents) count++;
    return count;
  }, [hasProfesseurs, hasMaitres, hasEnseignants2nd, hasNonPermanents]);

  const shouldShowCategoryFilters = availableCategoryCount > 1;

  const { processedData, chartOptions } = useMemo(() => {
    const dataSource =
      permanentCategory === "non_permanents" ? allData : evolutionData;

    if (!dataSource?.status_evolution || !dataSource?.years) {
      return { processedData: [], chartOptions: null };
    }

    const yearlyData = dataSource.status_evolution.map((yearData) => {
      const result: Record<string, string | number> = { year: yearData._id };

      yearData.status_breakdown.forEach((status) => {
        result[status.status] = status.count;
      });

      return result;
    });

    yearlyData.sort((a, b) => a.year.localeCompare(b.year));

    const hasNonPermanentsInData =
      allData?.status_evolution?.some((yearData) =>
        yearData.status_breakdown.some(
          (s) => s.status === "non_titulaire" && s.count > 0
        )
      ) || false;

    const availableStatuses = new Set<string>();
    if (allData?.status_evolution) {
      allData.status_evolution.forEach((yearData) => {
        yearData.status_breakdown.forEach((status) => {
          if (status.count > 0) {
            availableStatuses.add(status.status);
          }
        });
      });
    }

    let dataToProcess = yearlyData;

    if (permanentCategory === "all" && hasNonPermanentsInData) {
      dataToProcess = yearlyData.filter((data) => {
        return Array.from(availableStatuses).every((status) => {
          const value = data[status];
          return value !== undefined && value > 0;
        });
      });
    }

    if (permanentCategory === "non_permanents" && hasNonPermanentsInData) {
      dataToProcess = dataToProcess
        .filter((data) => {
          const nonTitulaire = data.non_titulaire;
          return nonTitulaire !== undefined && nonTitulaire > 0;
        })
        .map((data) => ({
          year: data.year,
          non_titulaire: data.non_titulaire,
          enseignant_chercheur: 0,
          titulaire_non_chercheur: 0,
        }));
    }

    const filteredYears = dataToProcess.map((data) => data.year as string);

    const statusData = {
      enseignant_chercheur: dataToProcess.map(
        (data) => data.enseignant_chercheur || 0
      ),
      titulaire_non_chercheur: dataToProcess.map(
        (data) => data.titulaire_non_chercheur || 0
      ),
      non_titulaire: dataToProcess.map((data) => data.non_titulaire || 0),
    };

    const contextTypeMap = {
      fields: "discipline",
      geo: "région",
      structures: "établissement",
    } as const;

    const options = createStatusEvolutionOptions({
      years: filteredYears,
      statusData,
      contextName: dataSource.context_info?.name || contextName,
      contextType: contextTypeMap[context],
    });

    return {
      processedData: dataToProcess,
      chartOptions: options,
    };
  }, [evolutionData, allData, context, contextName, permanentCategory]);

  const getCategoryLabel = () => {
    switch (permanentCategory) {
      case "professeurs":
        return { singular: "professeur", plural: "professeurs et assimilés" };
      case "maitres_conferences":
        return {
          singular: "maître de conférences",
          plural: "maîtres de conférences et assimilés",
        };
      case "enseignants_2nd_degre":
        return {
          singular: "enseignant du 2nd degré",
          plural: "enseignants du 2nd degré et Arts et métiers",
        };
      case "non_permanents":
        return {
          singular: "enseignant non permanent",
          plural: "enseignants non permanents",
        };
      default:
        return {
          singular: "personnel enseignant",
          plural: "personnels enseignants",
        };
    }
  };

  const categoryLabel = getCategoryLabel();

  const config = {
    id: "status-evolution-chart",
    idQuery: "faculty-members-evolution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h3" as const,
      fr: (
        <>
          Evolution par statut
          {permanentCategory !== "all" ? ` (${categoryLabel.plural})` : ""}
          &nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    comment: {
      fr: (
        <>
          Évolution des effectifs{" "}
          {permanentCategory !== "all"
            ? `des ${categoryLabel.plural}`
            : `du personnel enseignant`}{" "}
          selon trois grandes catégories de statut : les{" "}
          <GlossaryTerm term="enseignant-chercheur">
            enseignants-chercheurs
          </GlossaryTerm>
          , les{" "}
          <GlossaryTerm term="enseignant du secondaire affecté dans le supérieur">
            enseignants du secondaire affecté dans le supérieur
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
      {shouldShowCategoryFilters && (
        <div className="fr-mb-2w fr-flex fr-flex--center">
          <Button
            size="sm"
            onClick={() => setPermanentCategory("all")}
            variant={permanentCategory === "all" ? undefined : "secondary"}
            className="fr-mr-1v"
          >
            Tous
          </Button>
          {hasProfesseurs && (
            <Button
              size="sm"
              onClick={() => setPermanentCategory("professeurs")}
              variant={
                permanentCategory === "professeurs" ? undefined : "secondary"
              }
              className="fr-mr-1v"
            >
              Professeurs
            </Button>
          )}
          {hasMaitres && (
            <Button
              size="sm"
              onClick={() => setPermanentCategory("maitres_conferences")}
              variant={
                permanentCategory === "maitres_conferences"
                  ? undefined
                  : "secondary"
              }
              className="fr-mr-1v"
            >
              Maîtres de conf.
            </Button>
          )}
          {hasEnseignants2nd && (
            <Button
              size="sm"
              onClick={() => setPermanentCategory("enseignants_2nd_degre")}
              variant={
                permanentCategory === "enseignants_2nd_degre"
                  ? undefined
                  : "secondary"
              }
              className="fr-mr-1v"
            >
              Ens. 2nd degré
            </Button>
          )}
          {hasNonPermanents && (
            <Button
              size="sm"
              onClick={() => setPermanentCategory("non_permanents")}
              variant={
                permanentCategory === "non_permanents" ? undefined : "secondary"
              }
            >
              Non permanents
            </Button>
          )}
        </div>
      )}
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={processedData} />}
      />
    </div>
  );
}

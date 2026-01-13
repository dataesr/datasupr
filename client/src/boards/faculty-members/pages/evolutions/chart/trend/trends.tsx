import { useMemo, useState } from "react";
import { useContextDetection } from "../../../../utils";
import { useFacultyMembersEvolution } from "../../../../api/use-evolution";
import { createTrendsOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
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
      professeursData?.global_evolution &&
      professeursData.global_evolution.length > 0 &&
      professeursData.global_evolution.some((y) => y.total_count > 0)
    );
  }, [professeursData]);

  const hasMaitres = useMemo(() => {
    return (
      maitresData?.global_evolution &&
      maitresData.global_evolution.length > 0 &&
      maitresData.global_evolution.some((y) => y.total_count > 0)
    );
  }, [maitresData]);

  const hasEnseignants2nd = useMemo(() => {
    return (
      enseignants2ndData?.global_evolution &&
      enseignants2ndData.global_evolution.length > 0 &&
      enseignants2ndData.global_evolution.some((y) => y.total_count > 0)
    );
  }, [enseignants2ndData]);

  const hasNonPermanents = useMemo(() => {
    // Vérifier dans les données "all" (allData) pour détecter les non-permanents
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

  const { chartData, chartOptions } = useMemo(() => {
    // Pour non_permanents, utiliser allData car le backend ne gère peut-être pas encore ce filtre
    const dataSource =
      permanentCategory === "non_permanents" ? allData : evolutionData;

    if (
      !dataSource?.global_evolution ||
      !dataSource?.years ||
      !dataSource?.status_evolution
    ) {
      return { chartData: [], chartOptions: null };
    }

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

    let dataToProcess = dataSource.global_evolution;

    if (
      permanentCategory === "all" &&
      hasNonPermanentsInData &&
      allData?.status_evolution
    ) {
      const validYears = new Set(
        allData.status_evolution
          .filter((yearData) => {
            const yearStatuses = yearData.status_breakdown
              .filter((s) => s.count > 0)
              .map((s) => s.status);

            return Array.from(availableStatuses).every((status) =>
              yearStatuses.includes(status)
            );
          })
          .map((yearData) => yearData._id)
      );
      dataToProcess = dataSource.global_evolution.filter((yearData) =>
        validYears.has(yearData._id)
      );
    }

    if (
      permanentCategory === "non_permanents" &&
      hasNonPermanentsInData &&
      allData?.status_evolution
    ) {
      const yearsWithNonPermanents = new Set(
        allData.status_evolution
          .filter((yearData) =>
            yearData.status_breakdown.some(
              (s) => s.status === "non_titulaire" && s.count > 0
            )
          )
          .map((yearData) => yearData._id)
      );
      dataToProcess = dataToProcess.filter((yearData) =>
        yearsWithNonPermanents.has(yearData._id)
      );
      dataToProcess = dataToProcess.map((yearData) => {
        const yearStatusData = allData.status_evolution.find(
          (y) => y._id === yearData._id
        );
        const nonTitulaireData = yearStatusData?.status_breakdown.find(
          (s) => s.status === "non_titulaire"
        );

        if (!nonTitulaireData || !yearStatusData) return yearData;

        const totalAllStatuses = yearStatusData.status_breakdown.reduce(
          (sum, s) => sum + s.count,
          0
        );

        const nonTitulaireRatio =
          totalAllStatuses > 0 ? nonTitulaireData.count / totalAllStatuses : 0;

        return {
          _id: yearData._id,
          total_count: nonTitulaireData.count,
          gender_breakdown: yearData.gender_breakdown.map((g) => ({
            gender: g.gender,
            count: Math.round(g.count * nonTitulaireRatio),
          })),
        };
      });
    }

    const processedData = dataToProcess.map((yearData) => ({
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

    const filteredYears = processedData.map((d) => d.year);

    const contextTypeMap = {
      fields: "discipline",
      geo: "région",
      structures: "établissement",
    } as const;

    const options = createTrendsOptions({
      years: filteredYears,
      chartData: processedData,
      contextName: dataSource.context_info?.name || contextName,
      contextType: contextTypeMap[context],
    });

    return {
      chartData: processedData,
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
    id: "trends-evolution-chart",
    idQuery: "faculty-members-evolution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h3" as const,
      fr: (
        <>
          Evolution des effectifs
          {permanentCategory !== "all" ? ` (${categoryLabel.plural})` : ""}
          &nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    comment: {
      fr: (
        <>
          Ce graphique présente deux indicateurs clés sur l'évolution{" "}
          {permanentCategory !== "all"
            ? `des ${categoryLabel.plural}`
            : `du personnel enseignant`}{" "}
          : la croissance de l'effectif total et l'évolution de la{" "}
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
              variant={permanentCategory === "professeurs" ? undefined : "secondary"}
              className="fr-mr-1v"
            >
              Professeurs
            </Button>
          )}
          {hasMaitres && (
            <Button
              size="sm"
              onClick={() => setPermanentCategory("maitres_conferences")}
              variant={permanentCategory === "maitres_conferences" ? undefined : "secondary"}
              className="fr-mr-1v"
            >
              Maîtres de conf.
            </Button>
          )}
          {hasEnseignants2nd && (
            <Button
              size="sm"
              onClick={() => setPermanentCategory("enseignants_2nd_degre")}
              variant={permanentCategory === "enseignants_2nd_degre" ? undefined : "secondary"}
              className="fr-mr-1v"
            >
              Ens. 2nd degré
            </Button>
          )}
          {hasNonPermanents && (
            <Button
              size="sm"
              onClick={() => setPermanentCategory("non_permanents")}
              variant={permanentCategory === "non_permanents" ? undefined : "secondary"}
            >
              Non permanents
            </Button>
          )}
        </div>
      )}
      <ChartWrapper config={config} options={chartOptions} renderData={() => <RenderData data={chartData} />} />
    </div>
  );
}

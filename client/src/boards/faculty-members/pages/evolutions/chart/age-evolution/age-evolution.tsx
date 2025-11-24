import { useMemo, useState } from "react";
import { useContextDetection } from "../../../../utils";
import { useFacultyMembersEvolution } from "../../../../api/use-evolution";
import { createAgeEvolutionOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import SubtitleWithContext from "../../../../components/subtitle-with-context";
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
      professeursData?.age_evolution &&
      professeursData.age_evolution.length > 0 &&
      professeursData.age_evolution.some((y) =>
        y.age_breakdown.some((a) => a.count > 0)
      )
    );
  }, [professeursData]);

  const hasMaitres = useMemo(() => {
    return (
      maitresData?.age_evolution &&
      maitresData.age_evolution.length > 0 &&
      maitresData.age_evolution.some((y) =>
        y.age_breakdown.some((a) => a.count > 0)
      )
    );
  }, [maitresData]);

  const hasEnseignants2nd = useMemo(() => {
    return (
      enseignants2ndData?.age_evolution &&
      enseignants2ndData.age_evolution.length > 0 &&
      enseignants2ndData.age_evolution.some((y) =>
        y.age_breakdown.some((a) => a.count > 0)
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
    const dataSource = evolutionData;

    if (
      !dataSource?.age_evolution ||
      !dataSource?.years ||
      !dataSource?.status_evolution
    ) {
      return { processedData: null, chartOptions: null };
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

    let yearsToProcess = dataSource.years;

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
      yearsToProcess = dataSource.years.filter((year) => validYears.has(year));
    }

    const ageClasses = [
      "35 ans et moins",
      "36 à 55 ans",
      "56 ans et plus",
      "Non précisé",
    ];

    const yearlyData = yearsToProcess
      .map((year) => {
        const yearData = dataSource.age_evolution.find(
          (item) => item._id === year
        );

        if (!yearData) return null;

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

    const filteredYears = yearlyData.map((d) => d.year);

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
      years: filteredYears,
      ageData,
      contextName: dataSource.context_info?.name || contextName,
      contextType: contextTypeMap[context],
    });

    return {
      processedData: yearlyData,
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
    id: "age-evolution-chart",
    idQuery: "faculty-members-evolution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h3" as const,
      fr: (
        <>
          Evolution par âge
          {permanentCategory !== "all" ? ` (${categoryLabel.plural})` : ""}
          &nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    comment: {
      fr: (
        <>
          {permanentCategory !== "all"
            ? `Les ${categoryLabel.plural}`
            : `Le personnel enseignant`}{" "}
          rajeunit-il ou vieillit-il ? Ce graphique suit l'évolution de la part
          de chaque tranche d'âge au fil des ans. Chaque couleur représente une
          génération : les plus jeunes (35 ans et moins), la génération
          intermédiaire (36 à 55 ans) et les plus expérimentés (56 ans et plus).
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
      <div className="fr-alert fr-alert--error fr-my-3w">
        <p>Erreur lors du chargement des données </p>
      </div>
    );
  }

  return (
    <div className="age-evolution-chart">
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

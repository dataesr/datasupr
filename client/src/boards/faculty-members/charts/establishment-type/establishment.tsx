import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChartWrapper from "../../../../components/chart-wrapper";
import { createEstablishmentTypeChartOptions } from "./options";
import { useContextDetection, generateIntegrationURL } from "../../utils";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useEstablishmentTypeDistribution } from "./use-establishment-type";
import SubtitleWithContext from "../../components/subtitle-with-context";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import { Button } from "@dataesr/dsfr-plus";
import { useDataCompleteness } from "../../api/useDataCompleteness";

function RenderData({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="fr-table-responsive">
        <table
          className="fr-table fr-table--bordered fr-table--sm"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Type d'établissement</th>
              <th>Effectif total</th>
              <th>Pourcentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item._id || "Non précisé"}</td>
                <td>{item.total_count.toLocaleString()}</td>
                <td>
                  {item.percentage ? `${item.percentage.toFixed(1)}%` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EstablishmentTypeChart() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();
  const [displayMode, setDisplayMode] = useState<"effectif" | "percentage">(
    "effectif"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "enseignant_chercheur" | "titulaire_non_chercheur" | "non_titulaire"
  >("all");
  const { hasNonPermanentStaff } = useDataCompleteness();

  const {
    data: establishmentData,
    isLoading,
    error,
  } = useEstablishmentTypeDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
    status_filter: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: enseignantChercheurData } = useEstablishmentTypeDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
    status_filter: "enseignant_chercheur",
  });

  const { data: titulaireNonChercheurData } = useEstablishmentTypeDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
    status_filter: "titulaire_non_chercheur",
  });

  const { data: nonTitulaireData } = useEstablishmentTypeDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
    status_filter: "non_titulaire",
  });

  const largestEstablishmentType = useMemo(() => {
    if (
      !establishmentData?.establishment_type_distribution ||
      establishmentData.establishment_type_distribution.length === 0
    ) {
      return null;
    }
    return [...establishmentData.establishment_type_distribution].sort(
      (a, b) => b.total_count - a.total_count
    )[0];
  }, [establishmentData]);

  const config = {
    id: "establishment-type-chart",
    idQuery: "establishment-type-distribution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h3" as const,
      fr: (
        <>
          {statusFilter === "enseignant_chercheur"
            ? "Comment les enseignants-chercheurs se répartissent selon le type d'établissement ?"
            : statusFilter === "titulaire_non_chercheur"
            ? "Comment les enseignants du secondaire affectés dans le supérieur se répartissent selon le type d'établissement ?"
            : statusFilter === "non_titulaire"
            ? "Comment les enseignants non permanents se répartissent selon le type d'établissement ?"
            : hasNonPermanentStaff
            ? "Comment le personnel enseignant se répartit selon le type d'établissement ?"
            : "Comment les enseignants permanents se répartissent selon le type d'établissement ?"}
          &nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },

    comment: {
      fr: (
        <>
          Répartition des{" "}
          {statusFilter === "enseignant_chercheur" ? (
            <GlossaryTerm term="enseignant-chercheur">
              enseignants-chercheurs
            </GlossaryTerm>
          ) : statusFilter === "titulaire_non_chercheur" ? (
            <GlossaryTerm term="enseignant du secondaire affecté dans le supérieur">
              enseignants du secondaire affectés dans le supérieur
            </GlossaryTerm>
          ) : statusFilter === "non_titulaire" ? (
            <>enseignants non permanents</>
          ) : hasNonPermanentStaff ? (
            <GlossaryTerm term="personnel enseignant">
              personnels enseignants
            </GlossaryTerm>
          ) : (
            <GlossaryTerm term="enseignants permanents">
              enseignants permanents
            </GlossaryTerm>
          )}{" "}
          selon les différentes catégories d'
          <GlossaryTerm term="établissement d'enseignement supérieur">
            établissements d'enseignement supérieur
          </GlossaryTerm>
          .
          {!hasNonPermanentStaff && statusFilter === "all" && (
            <>
              <br />
              <strong>Note :</strong> Les données présentées ne concernent que
              les enseignants permanents. Les données relatives aux enseignants
              non-permanents ne sont pas disponibles pour cette période.
            </>
          )}
        </>
      ),
    },
    readingKey: {
      fr: (
        <>
          {largestEstablishmentType && (
            <>
              En {selectedYear}, on dénombre{" "}
              <strong>
                {largestEstablishmentType.total_count.toLocaleString()}
              </strong>{" "}
              {statusFilter === "enseignant_chercheur" ? (
                <GlossaryTerm term="enseignant-chercheur">
                  enseignants-chercheurs
                </GlossaryTerm>
              ) : statusFilter === "titulaire_non_chercheur" ? (
                <GlossaryTerm term="enseignant du secondaire affecté dans le supérieur">
                  enseignants du secondaire affectés dans le supérieur
                </GlossaryTerm>
              ) : statusFilter === "non_titulaire" ? (
                <>enseignants non permanents</>
              ) : hasNonPermanentStaff ? (
                <GlossaryTerm term="personnels enseignants">
                  personnels enseignants
                </GlossaryTerm>
              ) : (
                <GlossaryTerm term="enseignants permanents">
                  enseignants permanents
                </GlossaryTerm>
              )}{" "}
              dans les établissements de type "
              <strong>{largestEstablishmentType._id}</strong>".
            </>
          )}
        </>
      ),
    },
    sources: [{
      label: {
        fr: <>MESR-SIES, SISE</>,
        en: <>MESR-SIES, SISE</>,
      },
      update: new Date(),
      url: {
        fr: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
        en: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
      },
    }],
    integrationURL: generateIntegrationURL(context, "etablissements"),
  };

  const chartOptions = useMemo(() => {
    if (!establishmentData?.establishment_type_distribution) {
      return null;
    }

    const validTypes = establishmentData.establishment_type_distribution.filter(
      (et) => et.total_count > 0
    );

    if (validTypes.length === 0) {
      return null;
    }

    const total = validTypes.reduce((sum, et) => sum + et.total_count, 0);
    const categories = validTypes.map((et) => et._id || "Non précisé");
    const data = validTypes.map((et) => {
      if (displayMode === "percentage") {
        return total > 0 ? (et.total_count / total) * 100 : 0;
      }
      return et.total_count;
    });

    return createEstablishmentTypeChartOptions(categories, data, displayMode);
  }, [establishmentData, displayMode]);

  const tableData = useMemo(() => {
    if (!establishmentData?.establishment_type_distribution) return [];

    const total = establishmentData.establishment_type_distribution.reduce(
      (sum, et) => sum + et.total_count,
      0
    );

    return establishmentData.establishment_type_distribution.map((et) => ({
      _id: et._id || "Non précisé",
      total_count: et.total_count,
      percentage: total > 0 ? (et.total_count / total) * 100 : null,
    }));
  }, [establishmentData]);

  const hasEnseignantChercheur = useMemo(() => {
    return (
      enseignantChercheurData?.establishment_type_distribution &&
      enseignantChercheurData.establishment_type_distribution.length > 0 &&
      enseignantChercheurData.establishment_type_distribution.some(
        (et) => et.total_count > 0
      )
    );
  }, [enseignantChercheurData]);

  const hasTitulaireNonChercheur = useMemo(() => {
    return (
      titulaireNonChercheurData?.establishment_type_distribution &&
      titulaireNonChercheurData.establishment_type_distribution.length > 0 &&
      titulaireNonChercheurData.establishment_type_distribution.some(
        (et) => et.total_count > 0
      )
    );
  }, [titulaireNonChercheurData]);

  const hasNonTitulaire = useMemo(() => {
    return (
      nonTitulaireData?.establishment_type_distribution &&
      nonTitulaireData.establishment_type_distribution.length > 0 &&
      nonTitulaireData.establishment_type_distribution.some(
        (et) => et.total_count > 0
      )
    );
  }, [nonTitulaireData]);

  const availableStatusCount = useMemo(() => {
    let count = 0;
    if (hasEnseignantChercheur) count++;
    if (hasTitulaireNonChercheur) count++;
    if (hasNonTitulaire) count++;
    return count;
  }, [hasEnseignantChercheur, hasTitulaireNonChercheur, hasNonTitulaire]);

  const shouldShowStatusFilters = availableStatusCount > 1;

  const hasCurrentStatusData = useMemo(() => {
    if (statusFilter === "all") return true;
    if (statusFilter === "enseignant_chercheur") return hasEnseignantChercheur;
    if (statusFilter === "titulaire_non_chercheur")
      return hasTitulaireNonChercheur;
    if (statusFilter === "non_titulaire") return hasNonTitulaire;
    return false;
  }, [
    statusFilter,
    hasEnseignantChercheur,
    hasTitulaireNonChercheur,
    hasNonTitulaire,
  ]);

  useMemo(() => {
    if (!hasCurrentStatusData) {
      if (availableStatusCount > 1) {
        setStatusFilter("all");
      } else if (hasEnseignantChercheur) {
        setStatusFilter("enseignant_chercheur");
      } else if (hasTitulaireNonChercheur) {
        setStatusFilter("titulaire_non_chercheur");
      } else if (hasNonTitulaire) {
        setStatusFilter("non_titulaire");
      }
    }
  }, [
    hasCurrentStatusData,
    availableStatusCount,
    hasEnseignantChercheur,
    hasTitulaireNonChercheur,
    hasNonTitulaire,
  ]);

  if (context === "structures" && contextId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        <DefaultSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-text--center fr-py-3w fr-text--red">
        Erreur lors du chargement des données d'établissement : {error.message}
      </div>
    );
  }

  if (!chartOptions && availableStatusCount === 0) {
    return null;
  }

  if (!chartOptions) {
    return (
      <div className="fr-text--center fr-py-3w">
        <DefaultSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="fr-mb-2w fr-flex fr-flex--center">
        {shouldShowStatusFilters && (
          <div className="fr-mr-4v">
            <Button size="sm" onClick={() => setStatusFilter("all")} variant={statusFilter === "all" ? undefined : "secondary"} className="fr-mr-1v">
              Tous
            </Button>
            {hasEnseignantChercheur && (
              <Button
                size="sm"
                onClick={() => setStatusFilter("enseignant_chercheur")}
                variant={statusFilter === "enseignant_chercheur" ? undefined : "secondary"}
                className="fr-mr-1v"
              >
                Ens.-chercheurs
              </Button>
            )}
            {hasTitulaireNonChercheur && (
              <Button
                size="sm"
                onClick={() => setStatusFilter("titulaire_non_chercheur")}
                variant={statusFilter === "titulaire_non_chercheur" ? undefined : "secondary"}
                className="fr-mr-1v"
              >
                Ens. du 2nd degré
              </Button>
            )}
            {hasNonTitulaire && (
              <Button size="sm" onClick={() => setStatusFilter("non_titulaire")} variant={statusFilter === "non_titulaire" ? undefined : "secondary"}>
                Non permanents
              </Button>
            )}
          </div>
        )}
        <Button
          size="sm"
          onClick={() => setDisplayMode("effectif")}
          variant={displayMode === "effectif" ? undefined : "secondary"}
          className="fr-mr-2v fr-mt-1w"
        >
          Effectifs
        </Button>
        <Button
          size="sm"
          onClick={() => setDisplayMode("percentage")}
          variant={displayMode === "percentage" ? undefined : "secondary"}
          className="fr-mr-2v fr-mt-1w"
        >
          Pourcentage
        </Button>
      </div>
      <ChartWrapper config={config} options={chartOptions} renderData={() => <RenderData data={tableData} />} />
    </div>
  );
}

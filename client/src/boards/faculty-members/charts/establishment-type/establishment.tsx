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
  const { context, contextId, contextName } = useContextDetection();
  const [displayMode, setDisplayMode] = useState<"effectif" | "percentage">(
    "effectif"
  );

  const {
    data: establishmentData,
    isLoading,
    error,
  } = useEstablishmentTypeDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
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
          Comment le personnel enseignant se répartit selon le type
          d'établissement ?&nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },

    comment: {
      fr: (
        <>
          Répartition des{" "}
          <GlossaryTerm term="personnel enseignant">
            personnels enseignants
          </GlossaryTerm>{" "}
          selon les différentes catégories d'
          <GlossaryTerm term="établissement d'enseignement supérieur">
            établissements d'enseignement supérieur
          </GlossaryTerm>
          .
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
              personnels enseignants dans les établissements de type "
              <strong>{largestEstablishmentType._id}</strong>".
            </>
          )}
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

  if (!chartOptions) {
    return (
      <div className="fr-text--center fr-py-3w">
        <p>Aucune donnée disponible pour les types d'établissement</p>
        {selectedYear && <p>Année : {selectedYear}</p>}
        {contextId && <p>Contexte : {contextName} sélectionnée</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="fr-mb-2w fr-flex fr-flex--center">
        <Button
          size="sm"
          onClick={() => setDisplayMode("effectif")}
          variant={displayMode === "effectif" ? undefined : "secondary"}
          className="fr-mr-2v"
        >
          Effectifs
        </Button>
        <Button
          size="sm"
          onClick={() => setDisplayMode("percentage")}
          variant={displayMode === "percentage" ? undefined : "secondary"}
          className="fr-mr-2v"
        >
          Pourcentage
        </Button>
      </div>
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={tableData} />}
      />
    </div>
  );
}

import options from "./options";
import ChartWrapper from "../../../../components/chart-wrapper";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useDisciplineDistribution } from "./use-discipline-distribution";
import SubtitleWithContext from "../../components/subtitle-with-context";
import { useMemo, useState } from "react";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import { Button } from "@dataesr/dsfr-plus";

function RenderData({ data, contextHeaderLabel }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table-responsive">
      <table
        className="fr-table fr-table--bordered fr-table--sm"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>{contextHeaderLabel}</th>
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
              item.totalCount > 0
                ? ((item.maleCount / item.totalCount) * 100).toFixed(1)
                : "0.0";
            const femalePercent =
              item.totalCount > 0
                ? ((item.femaleCount / item.totalCount) * 100).toFixed(1)
                : "0.0";

            return (
              <tr key={index}>
                <td>{item.fieldLabel || "Non précisé"}</td>
                <td>{item.totalCount.toLocaleString()}</td>
                <td>{item.maleCount.toLocaleString()}</td>
                <td>{item.femaleCount.toLocaleString()}</td>
                <td>{malePercent}%</td>
                <td>{femalePercent}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const DistributionBar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();
  const [displayMode, setDisplayMode] = useState<"count" | "percentage">(
    "count"
  );

  const {
    data: disciplineData,
    isLoading,
    error,
  } = useDisciplineDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const itemsData = useMemo(() => {
    if (!disciplineData || !disciplineData.discipline_distribution) return [];

    return disciplineData.discipline_distribution.map((item) => {
      const maleData = item.gender_breakdown?.find(
        (g) => g.gender === "Masculin"
      );
      const femaleData = item.gender_breakdown?.find(
        (g) => g.gender === "Féminin"
      );

      return {
        year: selectedYear,
        field_id:
          item._id.discipline_code || item._id.geo_id || item._id.structure_id,
        fieldLabel:
          item._id.discipline_name ||
          item._id.geo_name ||
          item._id.structure_name,
        totalCount: item.total_count,
        maleCount: maleData?.count || 0,
        femaleCount: femaleData?.count || 0,
      };
    });
  }, [disciplineData, selectedYear]);

  const largestItem = useMemo(() => {
    if (!itemsData || itemsData.length === 0) return null;
    return [...itemsData].sort((a, b) => b.totalCount - a.totalCount)[0];
  }, [itemsData]);

  const getContextualLabels = (ctx) => {
    switch (ctx) {
      case "geo":
        return { singular: "la région", plural: "régions", header: "Région" };
      case "structures":
        return {
          singular: "l'établissement",
          plural: "établissements",
          header: "Établissement",
        };
      case "fields":
      default:
        return {
          singular: "la grande discipline",
          plural: "disciplines",
          header: "Grande Discipline",
        };
    }
  };

  const { singular, header } = getContextualLabels(context);

  if (context === "fields" && contextId) {
    return null;
  }

  const chartOptions = options({
    fieldsData: itemsData,
    selectedYear,
    displayMode,
    e: undefined,
  });
  const config = {
    id: "DistributionBar",
    idQuery: "discipline-distribution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      as: "h2",
      fr: (
        <>
          Quelles sont les grandes disciplines qui emploient le plus de
          personnel enseignant ?&nbsp;
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
          par{" "}
          <GlossaryTerm term="grande discipline">
            grande discipline
          </GlossaryTerm>{" "}
          avec visualisation de l'équilibre femmes-hommes.
        </>
      ),
    },
    readingKey: {
      fr: largestItem && (
        <>
          Par exemple, pour l'année universitaire {selectedYear}, pour{" "}
          {singular} <strong>"{largestItem.fieldLabel}"</strong>, on dénombre{" "}
          <strong>{largestItem.totalCount.toLocaleString()}</strong> personnels
          enseignants, dont{" "}
          <strong>{largestItem.maleCount.toLocaleString()}</strong> hommes et{" "}
          <strong>{largestItem.femaleCount.toLocaleString()}</strong> femmes.
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
    integrationURL: "/personnel-enseignant/discipline/typologie",
  };

  if (isLoading) {
    return (
      <div>
        <DefaultSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>Erreur lors du chargement des données</div>;
  }

  if (!itemsData || itemsData.length === 0) {
    return <div>Aucune donnée disponible pour l'année {selectedYear}</div>;
  }

  return chartOptions ? (
    <>
      <div className="fr-mb-2w fr-flex fr-flex--center">
        <Button
          variant={displayMode === "count" ? "primary" : "secondary"}
          onClick={() => setDisplayMode("count")}
          size="sm"
          className="fr-mr-2v"
        >
          Effectifs
        </Button>
        <Button
          variant={displayMode === "percentage" ? "primary" : "secondary"}
          onClick={() => setDisplayMode("percentage")}
          size="sm"
        >
          Pourcentage
        </Button>
      </div>
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={() => (
          <RenderData data={itemsData} contextHeaderLabel={header} />
        )}
      />
    </>
  ) : null;
};

export default DistributionBar;

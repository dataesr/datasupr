import { Link, Text } from "@dataesr/dsfr-plus";
import options from "./options";
import ChartWrapper from "../../../../components/chart-wrapper";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useDisciplineDistribution } from "./use-discipline-distribution";
import SubtitleWithContext from "../../pages/typology/utils/subtitle-with-context";

function RenderData({ data }) {
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
            <th>Discipline</th>
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

  const {
    data: disciplineData,
    isLoading,
    error,
  } = useDisciplineDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  if (context === "fields" && contextId) {
    return null;
  }

  const itemsData = (() => {
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
        field_id: item._id.discipline_code,
        fieldLabel: item._id.discipline_name,
        totalCount: item.total_count,
        maleCount: maleData?.count || 0,
        femaleCount: femaleData?.count || 0,
      };
    });
  })();

  const chartOptions = options({ fieldsData: itemsData, selectedYear });

  const config = {
    id: "DistributionBar",
    idQuery: "discipline-distribution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      as: "h2",
      fr: (
        <>
          Quelles sont les disciplines qui emploient le plus de personnel enseignant ?&nbsp;
          <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
        </>
      ),
    },
    description: {
      fr: "Ce graphique présente la répartition des effectifs d'enseignants par grande discipline, avec une visualisation de l'équilibre femmes-hommes dans chaque domaine. Les barres horizontales permettent de comparer facilement les effectifs totaux entre disciplines, tandis que les segments colorés illustrent la proportion respective des enseignants par genre. Le tableau associé détaille les effectifs précis et les pourcentages par discipline.",
    },
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
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={itemsData} />}
      />
      <div className="fr-mt-3w">
        <Text size="sm" className="text-center ">
          <Link href="/personnel-enseignant/discipline/typologie">
            En savoir plus sur la typologie des enseignants
          </Link>
        </Text>
      </div>
    </>
  ) : null;
};

export default DistributionBar;

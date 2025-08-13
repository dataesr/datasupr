import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { generateIntegrationURL, useContextDetection } from "../../../../utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useResearchTeachersData } from "../../use-cnu-data";
import { CnuGroupData, createCnuAgeCategoryOptions } from "./options"; // Assurez-vous d'importer la fonction mise à jour
import SubtitleWithContext from "../../../../components/subtitle-with-context";

function RenderData({ data }: { data: CnuGroupData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const ageOrder = ["35 ans et moins", "36 à 55 ans", "56 ans et plus"];

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <caption className="fr-sr-only">
        Répartition des enseignants-chercheurs par âge et catégorie
      </caption>
      <table>
        <thead>
          <tr>
            <th scope="col">Groupe CNU</th>
            {ageOrder.map((age) => (
              <th key={age} scope="col">
                {age}
              </th>
            ))}
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 100).map((group, index) => (
            <tr key={index}>
              <td>{group.cnuGroupLabel}</td>
              {ageOrder.map((ageClass) => {
                const ageData = group.ageDistribution.find(
                  (age) => age.ageClass === ageClass
                );
                return (
                  <td key={ageClass}>
                    {ageData
                      ? `${ageData.percent.toFixed(1)} % (${ageData.count})`
                      : "0 % (0)"}
                  </td>
                );
              })}
              <td>
                <strong>{group.totalCount}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CnuAgeDistribution() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const { context, contextId, contextName } = useContextDetection();

  const {
    data: researchTeachersData,
    isLoading,
    error,
  } = useResearchTeachersData({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const processedData = useMemo(() => {
    if (!researchTeachersData?.cnuGroups) return null;

    return researchTeachersData.cnuGroups
      .filter(
        (group) =>
          group.cnuGroupId &&
          group.ageDistribution &&
          group.ageDistribution.length > 0 &&
          group.categories &&
          group.categories.length > 0
      )
      .map((group) => ({
        cnuGroupId: group.cnuGroupId,
        cnuGroupLabel: group.cnuGroupLabel,
        totalCount: group.totalCount,
        ageDistribution: group.ageDistribution.filter(
          (age) => age.ageClass !== "Non précisé"
        ),
        maleCount: group.maleCount,
        femaleCount: group.femaleCount,
        categories: group.categories,
      }))
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [researchTeachersData]);

  const chartOptions = useMemo(() => {
    if (!processedData) return null;
    return createCnuAgeCategoryOptions(processedData);
  }, [processedData]);

  if (isLoading) {
    return <DefaultSkeleton />;
  }

  if (error) {
    return (
      <div className="fr-text--center fr-py-3w fr-text--red">
        Erreur lors du chargement des données
      </div>
    );
  }

  if (!chartOptions || !processedData) {
    const getEmptyMessage = () => {
      let message = `Aucune donnée disponible pour l'année ${selectedYear}`;

      if (contextId) {
        message += ` et ${
          contextName === "discipline"
            ? "la"
            : contextName === "région"
            ? "la"
            : "l'"
        } ${contextName} sélectionnée`;
      }

      return message;
    };

    return <div className="fr-text--center fr-py-3w">{getEmptyMessage()}</div>;
  }

  return (
    <div>
      <ChartWrapper
        config={{
          id: "cnu-age-category-distribution",
          idQuery: "cnu-age-category-distribution",
          title: {
            className: "fr-mt-0w",
            look: "h5",
            as: "h2",
            fr: (
              <>
                Répartition des enseignants-chercheurs par tranche d'âge et par
                catégorie&nbsp;
                <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
              </>
            ),
          },
          integrationURL: generateIntegrationURL(context, "cnu-age-category"),
        }}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={processedData} />}
      />
    </div>
  );
}

import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { generateIntegrationURL, useContextDetection } from "../../../../utils";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useFacultyMembersResearchTeachers } from "../../../../api/use-research-teachers";
import { CategoryData, createCategoryOptions } from "./options";
import SubtitleWithContext from "../../../../components/subtitle-with-context";

function RenderData({ data }: { data: CategoryData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.totalCount, 0);

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <caption className="fr-sr-only">
        Répartition des enseignants-chercheurs par catégorie
      </caption>
      <table>
        <thead>
          <tr>
            <th scope="col">Catégorie</th>
            <th scope="col">Femmes</th>
            <th scope="col">Hommes</th>
            <th scope="col">Total</th>
            <th scope="col">%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category, index) => (
            <tr key={index}>
              <td>{category.categoryName}</td>
              <td>{category.femaleCount.toLocaleString()}</td>
              <td>{category.maleCount.toLocaleString()}</td>
              <td>{category.totalCount.toLocaleString()}</td>
              <td>{Math.round((category.totalCount / total) * 100)}&nbsp;%</td>
            </tr>
          ))}
          <tr className="fr-table--blue-france">
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>
                {data
                  .reduce((acc, curr) => acc + curr.femaleCount, 0)
                  .toLocaleString()}
              </strong>
            </td>
            <td>
              <strong>
                {data
                  .reduce((acc, curr) => acc + curr.maleCount, 0)
                  .toLocaleString()}
              </strong>
            </td>
            <td>
              <strong>{total.toLocaleString()}</strong>
            </td>
            <td>
              <strong>100 %</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export const CategoryDistribution = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId, contextName } = useContextDetection();

  const {
    data: researchTeachersData,
    isLoading,
    error,
  } = useFacultyMembersResearchTeachers({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });
  console.log(researchTeachersData);
  const categoryData = useMemo(() => {
    if (!researchTeachersData?.categoryDistribution) return null;

    return researchTeachersData.categoryDistribution.sort(
      (a, b) => b.totalCount - a.totalCount
    );
  }, [researchTeachersData]);

  const chartOptions = useMemo(() => {
    if (!categoryData) return null;
    return createCategoryOptions(categoryData);
  }, [categoryData]);

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

  if (!chartOptions || !categoryData) {
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
    <ChartWrapper
      config={{
        id: "category-distribution",
        idQuery: "category-distribution",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          as: "h2",
          fr: (
            <>
              Répartition par catégorie&nbsp;
              <SubtitleWithContext classText="fr-text--lg fr-text--regular" />
            </>
          ),
        },
        integrationURL: generateIntegrationURL(
          context,
          "category-distribution"
        ),
      }}
      options={chartOptions}
      legend={null}
      renderData={() => <RenderData data={categoryData} />}
    />
  );
};

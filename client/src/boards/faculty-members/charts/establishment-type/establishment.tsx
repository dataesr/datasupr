import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ChartWrapper from "../../../../components/chart-wrapper";
import { createEstablishmentTypeChartOptions } from "./options";
import { useContextDetection, generateIntegrationURL } from "../../utils";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useEstablishmentTypeDistribution } from "./use-establishment-type";
import SubtitleWithContext from "../../components/subtitle-with-context";

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

  const {
    data: establishmentData,
    isLoading,
    error,
  } = useEstablishmentTypeDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const config = {
    id: "establishment-type-chart",
    idQuery: "establishment-type-distribution",
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h2" as const,
      fr: (
        <>
          Comment le personnel enseignant se répartit selon le type
          d'établissement ?&nbsp;
          <SubtitleWithContext />
        </>
      ),
    },
    description: {
      fr: "",
    },
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

    const categories = validTypes.map((et) => et._id || "Non précisé");
    const data = validTypes.map((et) => et.total_count);

    return createEstablishmentTypeChartOptions(categories, data);
  }, [establishmentData]);

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
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={tableData} />}
      />
    </div>
  );
}

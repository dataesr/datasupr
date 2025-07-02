import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import StatusOptions from "./options";
import ChartWrapper from "../../../../components/chart-wrapper";
import { useContextDetection, generateIntegrationURL } from "../../utils";
import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import { useStatusDistribution } from "./use-status-distribution";

function RenderData({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table--sm fr-table fr-table--bordered fr-mt-3w">
      <table className="fr-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Effectif total</th>
            <th>Non-titulaires</th>
            <th>Titulaires non-chercheurs</th>
            <th>Enseignants-chercheurs</th>
            <th>Total titulaires</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.fieldLabel || "Inconnu"}</td>
              <td>{item.totalCount.toLocaleString()}</td>
              <td>{item.nonTitulaires.toLocaleString()}</td>
              <td>{item.titulairesNonChercheurs.toLocaleString()}</td>
              <td>{item.enseignantsChercheurs.toLocaleString()}</td>
              <td>{item.totalTitulaires.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const StatusDistribution: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId, contextName } = useContextDetection();

  const {
    data: statusData,
    isLoading,
    error,
  } = useStatusDistribution({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const processedData = useMemo(() => {
    if (!statusData || !statusData.status_distribution) return [];

    return statusData.status_distribution.map((item) => {
      const totalCount = item.total_count;
      let enseignantsChercheurs = 0;
      let titulairesNonChercheurs = 0;
      let nonTitulaires = 0;

      item.status_breakdown?.forEach((status) => {
        switch (status.status) {
          case "enseignant_chercheur":
            enseignantsChercheurs = status.count;
            break;
          case "titulaire_non_chercheur":
            titulairesNonChercheurs = status.count;
            break;
          case "non_titulaire":
            nonTitulaires = status.count;
            break;
        }
      });
      return {
        fieldLabel:
          item._id.structure_name || item._id.field_name || item._id.geo_name,
        totalCount,
        nonTitulaires,
        titulairesNonChercheurs,
        enseignantsChercheurs,
        totalTitulaires: enseignantsChercheurs + titulairesNonChercheurs,
      };
    });
  }, [statusData]);

  const chartData = useMemo(() => {
    return processedData.map((item) => ({
      ...item,
      series: [
        {
          name: "Non-titulaires",
          value: item.nonTitulaires,
          color: "var(--blue-ecume-moon-675)",
        },
        {
          name: "Titulaires ",
          value: item.titulairesNonChercheurs,
          color: "var(--green-bourgeon-main-640)",
        },
        {
          name: "Enseignants-chercheurs",
          value: item.enseignantsChercheurs,
          color: "var(--orange-terre-battue-main-645)",
        },
      ],
    }));
  }, [processedData]);

  const chartOptions = StatusOptions({
    disciplines: chartData,
  });

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
        Erreur lors du chargement des données par statut
      </div>
    );
  }

  if (!statusData || processedData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour les statuts pour l'année {selectedYear}
        {contextId &&
          ` et ${
            contextName === "discipline"
              ? "la"
              : contextName === "région"
              ? "la"
              : "l'"
          } ${contextName} sélectionnée`}
      </div>
    );
  }

  return (
    <div>
      <ChartWrapper
        config={{
          id: "statusDistribution",
          idQuery: "status-distribution",
          title: {
            fr: contextId
              ? `Répartition par statut - ${contextName} sélectionnée`
              : "Répartition par statut des enseignants",
          },
          description: {
            fr: "blabla",
          },
          integrationURL: generateIntegrationURL(context, "statuts"),
        }}
        options={chartOptions}
        legend={null}
        renderData={() => <RenderData data={processedData} />}
      />
    </div>
  );
};

export default StatusDistribution;

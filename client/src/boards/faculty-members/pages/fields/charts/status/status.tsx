import { useMemo } from "react";
import StatusOptions from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import useFacultyMembersByStatus from "../../api/use-by-status";

interface StatusDistributionProps {
  selectedYear: string;
  fieldId?: string;
}

const StatusDistribution: React.FC<StatusDistributionProps> = ({
  selectedYear,
  fieldId,
}) => {
  const {
    data: statusData,
    isLoading,
    error,
  } = useFacultyMembersByStatus(selectedYear, fieldId);
  const config = {
    id: "statusDistribution",
    idQuery: "statusDistribution",
    title: {
      fr: fieldId
        ? "Répartition par statut de la discipline sélectionnée"
        : "Répartition par statut des enseignants par discipline",
      en: fieldId
        ? "Distribution of faculty members by status for selected field"
        : "Distribution of faculty members by status",
    },
    description: {
      fr: fieldId
        ? "Répartition des enseignants par statut pour la discipline sélectionnée"
        : "Répartition des enseignants par statut et discipline",
      en: fieldId
        ? "Distribution of faculty members by status for selected field"
        : "Distribution of faculty members by status and discipline",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };

  const processedData = useMemo(() => {
    // Trouver les données pour l'année spécifiée
    const yearData = statusData?.find((data) => data.year === selectedYear);
    const dataToProcess = yearData?.disciplines;

    if (!dataToProcess || dataToProcess.length === 0) return [];

    const sortedData = [...dataToProcess]
      .sort((a, b) => {
        const totalA = a.totalCount || a.total_count || 0;
        const totalB = b.totalCount || b.total_count || 0;
        return totalB - totalA;
      })
      // Si fieldId est spécifié, ne pas limiter à 8 (une seule discipline)
      .slice(0, fieldId ? dataToProcess.length : 8);

    return sortedData.map((disc) => {
      const totalCount = disc.totalCount || disc.total_count || 0;
      const titulaires = disc.status?.titulaires?.count || disc.titulaires || 0;
      const nonTitulaires = Number(
        disc.status?.nonTitulaires?.count ||
          disc.non_titulaires ||
          totalCount - Number(titulaires)
      );
      const enseignantsChercheurs = Number(
        disc.status?.enseignantsChercheurs?.count ||
          disc.enseignants_chercheurs ||
          0
      );

      const autresTitulaires =
        Number(titulaires) - Number(enseignantsChercheurs);

      return {
        fieldLabel: disc.fieldLabel || disc.field_label || "",
        enseignantsChercheurs,
        autresTitulaires,
        nonTitulaires,
        totalCount,
      };
    });
  }, [statusData, selectedYear, fieldId]);

  const chartOptions = StatusOptions({
    disciplines: processedData,
  });

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des données par statut...
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
        {fieldId && " et la discipline sélectionnée"}
      </div>
    );
  }

  return (
    <div>
      <ChartWrapper
        config={config}
        options={chartOptions}
        legend={null}
        renderData={undefined}
      />
      <div className="fr-text--xs fr-text--italic fr-mt-1w">
        Note: Les enseignants-chercheurs sont tous titulaires. La catégorie
        "Autres titulaires" comprend le personnel titulaire non
        enseignant-chercheur.
        {fieldId && (
          <>
            Données filtrées pour la discipline sélectionnée.
            <br />
          </>
        )}
      </div>
    </div>
  );
};

export default StatusDistribution;

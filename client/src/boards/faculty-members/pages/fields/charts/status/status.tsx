import React, { useMemo } from "react";
import ChartWrapper from "../../../../components/chart-wrapper";
import StatusOptions from "./options";
import { Field } from "../../../../types";

interface StatusDistributionProps {
  disciplinesData: Field[];
  title?: string;
}

const StatusDistribution: React.FC<StatusDistributionProps> = ({
  disciplinesData,
  title = "Répartition par statut du personnel enseignant",
}) => {
  const processedData = useMemo(() => {
    if (!disciplinesData || disciplinesData.length === 0) return [];
    const sortedData = [...disciplinesData]
      .sort((a, b) => {
        const totalA = a.totalCount || a.total_count || 0;
        const totalB = b.totalCount || b.total_count || 0;
        return totalB - totalA;
      })
      .slice(0, 8);

    return sortedData.map((disc) => {
      const totalCount = disc.totalCount || disc.total_count || 0;
      const titulaires = disc.status?.titulaires?.count || disc.titulaires || 0;
      const nonTitulaires =
        disc.status?.nonTitulaires?.count ||
        disc.non_titulaires ||
        totalCount - titulaires;

      const enseignantsChercheurs =
        disc.status?.enseignantsChercheurs?.count ||
        disc.enseignants_chercheurs ||
        0;

      const autresTitulaires = titulaires - enseignantsChercheurs;

      return {
        fieldLabel: disc.fieldLabel || disc.field_label || "",
        enseignantsChercheurs,
        autresTitulaires,
        nonTitulaires,
        totalCount,
      };
    });
  }, [disciplinesData]);

  const chartOptions = StatusOptions({
    disciplines: processedData,
    title,
  });

  if (
    !disciplinesData ||
    disciplinesData.length === 0 ||
    processedData.length === 0
  )
    return null;

  return (
    <div>
      <ChartWrapper
        id="statusDistribution"
        options={chartOptions}
        legend={null}
      />
      <div className="fr-text--xs fr-text--italic fr-mt-1w">
        Note: Les enseignants-chercheurs sont tous titulaires. La catégorie
        "Autres titulaires" comprend le personnel titulaire non
        enseignant-chercheur.
      </div>
    </div>
  );
};

export default StatusDistribution;

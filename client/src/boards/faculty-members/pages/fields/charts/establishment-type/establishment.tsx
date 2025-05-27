import { useMemo } from "react";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { EstablishmentTypeChartProps } from "../../types";
import { createEstablishmentTypeChartOptions } from "./options";

export function EstablishmentTypeChart({
  establishmentData,
  isLoading,
  year,
}: EstablishmentTypeChartProps) {
  const config = {
    id: "establishment-type-chart",
    idQuery: "establishment-type-chart",
    title: {
      fr: "Répartition du personnel enseignant par type d'établissement",
      en: "Distribution of faculty members by type of establishment",
    },
    description: {
      fr: "Répartition des enseignants par type d'établissement",
      en: "Distribution of faculty members by type of establishment",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };

  const chartOptions = useMemo(() => {
    if (!establishmentData || !establishmentData.establishmentTypes) {
      return null;
    }

    const sortedTypes = [...establishmentData.establishmentTypes].sort(
      (a, b) => b.totalCount - a.totalCount
    );

    const categories = sortedTypes.map((et) => et.type);
    const data = sortedTypes.map((et) => et.totalCount);

    return CreateChartOptions(
      "column",
      createEstablishmentTypeChartOptions(categories, data, year)
    );
  }, [establishmentData, year]);
  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des données par établissement...
      </div>
    );
  }

  if (!chartOptions) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour les types d'établissement cette année
      </div>
    );
  }

  return (
    <ChartWrapper
      config={config}
      options={chartOptions}
      legend={null}
      renderData={undefined}
    />
  );
}

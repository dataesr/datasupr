import { useMemo } from "react";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import ChartWrapper from "../../../../../../components/chart-wrapper";

interface GenderStructureData {
  structureType: Array<{
    type: string;
    femmesPercent: number;
    hommesPercent: number;
  }>;
}

interface GenderPerStructureTypeChartProps {
  structureData: GenderStructureData;
  isLoading: boolean;
  year: string;
}

export function GenderPerStructureTypeChart({
  structureData,
  isLoading,
  year,
}: GenderPerStructureTypeChartProps) {
  const config = {
    id: "gender-structure-type-chart",
    idQuery: "gender-structure-type-chart",
    title: {
      fr: "Répartition du personnel enseignant par sexe par type d'établissement",
      en: "Distribution of faculty members by geder and type of establishment",
    },
    description: {
      fr: "Répartition du personnel enseignant par sexe et par type d'établissement",
      en: "Distribution of faculty members by",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };
  const chartOptions = useMemo(() => {
    if (!structureData || !structureData.structureType) {
      return null;
    }

    const data = structureData;

    return CreateChartOptions("pie", {
      chart: {
        type: "pie",
        height: "40%",
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
      },
      title: {
        text: "Répartition du personnel enseignant par sexe par type d'établissement",
      },
      subtitle: {
        text: `Année universitaire ${year}`,
      },
      tooltip: {
        valueSuffix: " enseignants",
        pointFormat: "<b>{point.category}</b>: {point.y:,.0f} enseignants",
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: "bold",
              color: "white",
            },
          },
          startAngle: -90,
          endAngle: 90,
          center: ["50%", "75%"],
          size: "110%",
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: "pie",
          name: "Répartition F/H",
          data: data,
        },
      ],
      credits: { enabled: false },
    });
  }, [structureData, year]);

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

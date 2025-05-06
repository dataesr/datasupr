import { useMemo } from "react";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import ChartWrapper from "../../../../components/chart-wrapper";

interface EstablishmentData {
  establishmentTypes: Array<{
    type: string;
    totalCount: number;
  }>;
}

interface EstablishmentTypeChartProps {
  establishmentData: EstablishmentData;
  isLoading: boolean;
  year: string;
}

export function EstablishmentTypeChart({
  establishmentData,
  isLoading,
  year,
}: EstablishmentTypeChartProps) {
  const chartOptions = useMemo(() => {
    if (!establishmentData || !establishmentData.establishmentTypes) {
      return null;
    }

    const sortedTypes = [...establishmentData.establishmentTypes].sort(
      (a, b) => b.totalCount - a.totalCount
    );

    const categories = sortedTypes.map((et) => et.type);
    const data = sortedTypes.map((et) => et.totalCount);

    return CreateChartOptions("column", {
      chart: {
        type: "column",
        // height: 400,
      },
      title: {
        text: "Répartition du personnel enseignant par type d'établissement",
      },
      subtitle: {
        text: `Année universitaire ${year}`,
      },
      xAxis: {
        categories: categories,
        title: {
          text: null,
        },
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Nombre d'enseignants",
          align: "high",
        },
        labels: {
          overflow: "justify",
        },
      },
      tooltip: {
        valueSuffix: " enseignants",
        pointFormat: "<b>{point.category}</b>: {point.y:,.0f} enseignants",
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color: "white",
              textOutline: "1px contrast",
            },
          },
          colorByPoint: true,
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: "Effectif total",
          data: data,
          type: "column",
        },
      ],
      credits: { enabled: false },
    });
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
      id="establishment-type-chart"
      options={chartOptions}
      legend={null}
    />
  );
}

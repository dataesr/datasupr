import { useMemo } from "react";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import ChartWrapper from "../../../../../../components/chart-wrapper";

interface DisciplineStatusStackProps {
  statusData: Array<{
    disciplines?: Array<{
      fieldLabel: string;
      fieldId?: string;
      totalCount: number;
      status?: {
        enseignantsChercheurs?: { count: number };
        titulaires?: { count: number };
      };
    }>;
  }>;
  isLoading: boolean;
  year: string;
  fieldId?: string;
}

export function DisciplineStatusStack({
  statusData,
  isLoading,
  year,
}: DisciplineStatusStackProps) {
  const config = {
    id: "discipline-status-stack",
    idQuery: "discipline-status-stack",
    title: {
      fr: "Répartition par statut au sein des disciplines",
      en: "Distribution of faculty members by status within disciplines",
    },
    description: {
      fr: "Evolution des effectifs enseignants par statut et discipline",
      en: "Evolution of faculty members by status and discipline",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };
  const chartOptions = useMemo(() => {
    if (!statusData || !statusData[0] || !statusData[0].disciplines) {
      return null;
    }

    const disciplines = [...statusData[0].disciplines].sort(
      (a, b) => b.totalCount - a.totalCount
    );

    const categories = disciplines.map((d) => d.fieldLabel);
    const ecData = disciplines.map(
      (d) => d.status?.enseignantsChercheurs?.count || 0
    );
    const autresTitulairesData = disciplines.map(
      (d) =>
        (d.status?.titulaires?.count || 0) -
        (d.status?.enseignantsChercheurs?.count || 0)
    );
    const nonTitulairesData = disciplines.map(
      (d) => d.totalCount - (d.status?.titulaires?.count || 0)
    );

    return CreateChartOptions("bar", {
      chart: {
        type: "bar",
        height: 600,
      },
      title: {
        text: "Répartition par statut au sein des disciplines",
      },
      subtitle: {
        text: `Année ${year}. Trier par effectif total décroissant.`,
      },
      xAxis: {
        categories: categories,
        title: {
          text: null,
        },
        labels: {
          style: {
            fontSize: "11px",
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Effectif",
          align: "high",
        },
        labels: {
          overflow: "justify",
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            color: "gray",
            textOutline: "none",
          },
          formatter: function () {
            return this.total.toLocaleString();
          },
        },
      },
      tooltip: {
        valueSuffix: " personnes",
        shared: true,
      },
      plotOptions: {
        bar: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
          },
          cursor: "pointer",
          point: {
            events: {
              click: function () {
                const discipline = disciplines.find(
                  (d) => d.fieldLabel === this.category
                );
                if (discipline && discipline.fieldId) {
                  window.location.href = `/personnel-enseignant/discipline/typologie/${discipline.fieldId}`;
                }
              },
            },
          },
          states: {
            hover: {
              brightness: -0.1,
            },
            select: {
              color: "#a4edba",
              borderColor: "black",
              borderWidth: 2,
            },
          },
        },
      },
      legend: {
        reversed: true,
      },
      series: [
        {
          name: "Non-Titulaires",
          data: nonTitulairesData,
          color: "#6a6a6a",
          type: "bar",
        },
        {
          name: "Autres Titulaires",
          data: autresTitulairesData,
          color: "#4B9DFF",
          type: "bar",
        },
        {
          name: "Enseignants-Chercheurs",
          data: ecData,
          color: "#000091",
          type: "bar",
        },
      ],
      credits: { enabled: false },
    });
  }, [statusData, year]);

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement de la répartition...
      </div>
    );
  }

  if (!chartOptions) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour cette représentation
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

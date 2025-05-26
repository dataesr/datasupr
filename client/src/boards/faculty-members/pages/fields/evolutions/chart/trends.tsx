import { useMemo } from "react";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import ChartWrapper from "../../../../../../components/chart-wrapper";

interface EvolutionChartProps {
  evolutionData: {
    years: string[];
    globalTrend: {
      totalCount: number[];
      femmes_percent: number[];
      hommes_percent: number[];
      titulaires_percent: number[];
      enseignants_chercheurs_percent: number[];
    };
    disciplinesTrend: {
      [key: string]: {
        fieldId: string;
        fieldLabel: string;
        totalCount: number[];
        femmes_percent: number[];
        titulaires_percent: number[];
        enseignants_chercheurs_percent: number[];
      };
    };
  };
  disciplineId?: string;
  isLoading: boolean;
}

export function EvolutionGlobalChart({
  evolutionData,
  disciplineId,
  isLoading,
}: EvolutionChartProps) {
  const config = {
    id: "faculty-count-evolution",
    idQuery: "faculty-count-evolution",
    title: {
      fr: "Evolution des effectifs enseignants",
      en: "Evolution of faculty members count",
    },
    description: {
      fr: "Evolution des effectifs enseignants par statut et discipline",
      en: "Evolution of faculty members count by status and discipline",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };

  const specificFieldData = useMemo(() => {
    if (!disciplineId || !evolutionData?.disciplinesTrend) return null;
    return evolutionData.disciplinesTrend[disciplineId] || null;
  }, [evolutionData, disciplineId]);

  const chartOptions = useMemo(() => {
    if (
      !evolutionData ||
      !evolutionData.years ||
      evolutionData.years.length === 0
    ) {
      return null;
    }

    const years = evolutionData.years;
    const isDisciplineSpecific = disciplineId && specificFieldData;

    const totalCountData = isDisciplineSpecific
      ? specificFieldData.totalCount
      : evolutionData.globalTrend.totalCount;

    const femmesData = isDisciplineSpecific
      ? years.map(
          (_, i) =>
            (totalCountData[i] * specificFieldData.femmes_percent[i]) / 100
        )
      : years.map(
          (_, i) =>
            (evolutionData.globalTrend.totalCount[i] *
              evolutionData.globalTrend.femmes_percent[i]) /
            100
        );

    const hommesData = isDisciplineSpecific
      ? years.map(
          (_, i) =>
            (totalCountData[i] * (100 - specificFieldData.femmes_percent[i])) /
            100
        )
      : years.map(
          (_, i) =>
            (evolutionData.globalTrend.totalCount[i] *
              evolutionData.globalTrend.hommes_percent[i]) /
            100
        );

    const chartTitle = isDisciplineSpecific
      ? `Évolution des effectifs - ${specificFieldData.fieldLabel}`
      : "Évolution des effectifs enseignants";

    return CreateChartOptions("column", {
      chart: {
        height: 500,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 120,
      },
      title: {
        text: chartTitle,
        style: { fontSize: "18px", fontWeight: "bold" },
      },
      subtitle: {
        text: `Période de ${years[0] || ""} à ${years[years.length - 1] || ""}`,
        style: { fontSize: "14px" },
      },
      xAxis: {
        categories: years,
        title: { text: "Année académique" },
        labels: { style: { fontSize: "12px" } },
      },
      yAxis: {
        min: 0,
        title: { text: "Nombre d'enseignants" },
        labels: {
          formatter: function () {
            return this.value.toLocaleString();
          },
        },
        stackLabels: {
          enabled: true,
          formatter: function () {
            return this.total >= 10000
              ? Math.round(this.total / 1000) + "k"
              : this.total.toLocaleString();
          },
          style: {
            fontWeight: "bold",
            color: "black",
          },
        },
      },
      tooltip: {
        shared: false,
        formatter: function () {
          const y = this.y || 0;
          const total = totalCountData[this.point.index] || 1;
          const percent = ((y / total) * 100).toFixed(1);

          return `<b>Année ${this.x}</b><br>
           <span style="color:${this.color}">\u25CF</span> ${
            this.series.name
          }: <b>${y.toLocaleString()}</b><br>
           <span style="color:#666666">Part: ${percent}% du total</span><br>
           <span style="color:#000091">Total: ${total.toLocaleString()}</span>`;
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
          },
          borderWidth: 0,
        },
        series: {
          animation: { duration: 1000 },
        },
      },
      series: [
        {
          name: "Hommes",
          data: hommesData,
          color: "#6a6a6a",
          type: "column",
        },
        {
          name: "Femmes",
          data: femmesData,
          color: "#EA526F",
          type: "column",
        },
      ],
      annotations: [
        {
          shapes: years.map((_year, i) => ({
            type: "circle",
            point: { x: i, y: totalCountData[i], xAxis: 0, yAxis: 0 },
            r: 3,
            fill: "transparent",
            stroke: "#000091",
            "stroke-width": 2,
          })),
        },
      ],
      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
      },
      credits: { enabled: false },
    });
  }, [evolutionData, disciplineId, specificFieldData]);

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-5w">
        <span
          className="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
          aria-hidden="true"
        ></span>
        <p className="fr-mt-2w">Chargement des données d'évolution...</p>
      </div>
    );
  }

  if (!chartOptions) {
    return (
      <div className="fr-alert fr-alert--info fr-my-3w">
        <p>Aucune donnée d'évolution disponible.</p>
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
    </div>
  );
}

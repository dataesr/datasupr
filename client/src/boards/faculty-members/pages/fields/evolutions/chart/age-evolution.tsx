import { useMemo } from "react";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { AgeEvolutionChartProps } from "../../types";

export function AgeEvolutionChart({
  ageEvolutionData,
  disciplineId,
  isLoading,
}: AgeEvolutionChartProps) {
  const config = {
    id: "faculty-age-evolution",
    idQuery: "faculty-age-evolution",
    title: {
      fr: "Répartition par âge des enseignants par discipline",
      en: "Distribution of faculty members by age and discipline",
    },
    description: {
      fr: "Répartition des enseignants par âge et discipline",
      en: "Distribution of faculty members by age and discipline",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };
  const disciplineToShow = useMemo(() => {
    if (!ageEvolutionData || !ageEvolutionData.ageEvolution) return null;

    if (disciplineId && ageEvolutionData.ageEvolution[disciplineId]) {
      return ageEvolutionData.ageEvolution[disciplineId];
    }

    return ageEvolutionData.ageEvolution["global"];
  }, [ageEvolutionData, disciplineId]);

  const chartOptions = useMemo(() => {
    if (!ageEvolutionData || !disciplineToShow) {
      return null;
    }

    const years = ageEvolutionData.years;

    const ageColors = {
      "<30": "#4B9DFF",
      "30-40": "#000091",
      "40-50": "#6A6AF4",
      "50-60": "#EA526F",
      ">60": "#78022C",
    };

    const ageClasses = Object.keys(disciplineToShow.ageData).sort((a, b) => {
      const ageOrder = {
        "<36": 0,
        "36-55": 1,
        ">55": 2,
      };

      return ageOrder[b] - ageOrder[a];
    });

    const series = ageClasses.map((ageClass) => ({
      name:
        ageClass === "<36"
          ? "Moins de 36 ans"
          : ageClass === ">55"
          ? "Plus de 55 ans"
          : `${ageClass}`,
      data: disciplineToShow.ageData[ageClass].percents,
      color: ageColors[ageClass],
      type: "area" as const,
    }));
    const chartTitle = `Évolution de la pyramide des âges - ${disciplineToShow.fieldLabel}`;

    return CreateChartOptions("area", {
      chart: {
        height: 500,
        type: "area",
        marginLeft: 0,
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
        max: 100,
        title: {
          text: "Répartition (%)",
          style: {
            fontSize: "12px",
            color: "#666666",
          },
        },
        labels: {
          formatter: function () {
            return this.value + "%";
          },
        },
      },
      tooltip: {
        formatter: function () {
          return `<b>${this.series.name}</b><br>
                 Année ${this.x}: <b>${this.y?.toFixed(1) || "0.0"}%</b>`;
        },
      },
      plotOptions: {
        area: {
          stacking: "percent",
          marker: {
            enabled: false,
            symbol: "circle",
            radius: 2,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 2,
            },
          },
        },
      },
      legend: {
        enabled: true,
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },
      series: series,
      credits: { enabled: false },
    });
  }, [ageEvolutionData, disciplineToShow]);

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-5w">
        <span
          className="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
          aria-hidden="true"
        ></span>
        <p className="fr-mt-2w">
          Chargement des données d'évolution par âge...
        </p>
      </div>
    );
  }

  if (!chartOptions) {
    return (
      <div className="fr-alert fr-alert--info fr-my-3w">
        <p>Aucune donnée d'évolution par âge disponible.</p>
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

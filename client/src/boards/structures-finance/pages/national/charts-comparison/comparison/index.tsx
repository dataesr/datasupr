import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CHART_COLORS } from "../../../../constants/colors";

interface ComparisonItem {
  etablissement_actuel_lib: string;
  etablissement_id_paysage_actuel: string;
  [key: string]: any;
}

interface ComparisonChartProps {
  items: ComparisonItem[];
  selectedMetric: string;
}

const metrics = {
  scsp: { label: "SCSP (État)", color: CHART_COLORS.primary },
  recettes_propres: {
    label: "Recettes propres",
    color: CHART_COLORS.secondary,
  },
  droits_d_inscription: {
    label: "Droits d'inscription",
    color: CHART_COLORS.palette[1],
  },
  formation_continue_diplomes_propres_et_vae: {
    label: "Formation continue",
    color: CHART_COLORS.tertiary,
  },
  taxe_d_apprentissage: {
    label: "Taxe d'apprentissage",
    color: CHART_COLORS.palette[5],
  },
  anr_hors_investissements_d_avenir: {
    label: "ANR hors investissements",
    color: CHART_COLORS.quaternary,
  },
  anr_investissements_d_avenir: {
    label: "ANR investissements",
    color: CHART_COLORS.palette[7],
  },
  contrats_et_prestations_de_recherche_hors_anr: {
    label: "Contrats & prestations",
    color: CHART_COLORS.palette[2],
  },
  subventions_de_la_region: {
    label: "Subventions région",
    color: CHART_COLORS.palette[1],
  },
  subventions_union_europeenne: {
    label: "Subventions UE",
    color: CHART_COLORS.palette[6],
  },
  autres_ressources_propres: {
    label: "Autres ressources",
    color: CHART_COLORS.palette[10],
  },
  autres_subventions: {
    label: "Autres subventions",
    color: CHART_COLORS.palette[11],
  },
  scsp_par_etudiants: {
    label: "SCSP par étudiant",
    color: CHART_COLORS.palette[8],
  },
};

export default function ComparisonChart({
  items,
  selectedMetric,
}: ComparisonChartProps) {
  const options: Highcharts.Options = useMemo(() => {
    if (!items.length || !selectedMetric) {
      return {
        chart: { type: "bar" },
        title: { text: "Sélectionnez une métrique" },
        series: [],
      };
    }

    const metricConfig =
      metrics[selectedMetric as keyof typeof metrics] || metrics.scsp;

    const data = items
      .sort((a, b) => (b[selectedMetric] || 0) - (a[selectedMetric] || 0))
      .map((item) => ({
        name: item.etablissement_actuel_lib,
        y: item[selectedMetric] || 0,
      }));

    return {
      chart: { type: "bar", height: 400 },
      title: { text: undefined },
      tooltip: {
        headerFormat: "<b>{point.name}</b><br/>",
        pointFormat: `<b>${metricConfig.label}: {point.y:,.0f}</b>`,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            format: "{point.y:,.0f}",
          },
        },
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        title: { text: metricConfig.label },
      },
      legend: { enabled: false },
      series: [
        {
          type: "bar",
          name: metricConfig.label,
          data: data,
          color: metricConfig.color,
        },
      ],
      credits: { enabled: false },
    };
  }, [items, selectedMetric]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

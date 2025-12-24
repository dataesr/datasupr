import { useMemo } from "react";
import Highcharts from "highcharts";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CHART_COLORS, DSFR_COLORS } from "../../../../constants/colors";

interface DataPoint {
  etablissement_id_paysage_actuel: string;
  etablissement_actuel_lib: string;
  region: string;
  type: string;
  etablissement_actuel_typologie: string;
  [key: string]: any;
}

interface AdvancedScatterChartProps {
  data: DataPoint[];
  xAxis: string;
  yAxis: string;
  sizeMetric?: string;
  colorMetric?: string;
  colorBy?: "region" | "type" | "typologie" | "metric";
}

const metricLabels: Record<string, string> = {
  scsp: "SCSP (€)",
  scsp_par_etudiants: "SCSP par étudiant (€)",
  taux_encadrement: "Taux d'encadrement (%)",
  effectif_sans_cpge: "Effectif étudiant",
  emploi_etpt: "Emplois (ETPT)",
  recettes_propres: "Recettes propres (€)",
  part_ressources_propres: "Part ressources propres (%)",
  charges_de_personnel: "Charges de personnel (€)",
  taux_de_remuneration_des_permanents: "Taux de rémunération permanents (%)",
  charges_de_personnel_produits_encaissables:
    "Charges personnel / Produits (%)",
  part_droits_d_inscription: "Part droits d'inscription (%)",
  part_formation_continue_diplomes_propres_et_vae:
    "Part formation continue (%)",
  part_taxe_d_apprentissage: "Part taxe d'apprentissage (%)",
  part_anr_hors_investissements_d_avenir: "Part ANR hors invest. (%)",
  part_contrats_et_prestations_de_recherche_hors_anr:
    "Part contrats recherche (%)",
  part_subventions_de_la_region: "Part subventions région (%)",
  part_subventions_union_europeenne: "Part subventions UE (%)",
};

const regionColors: Record<string, string> = {
  "Auvergne-Rhône-Alpes": CHART_COLORS.palette[0],
  "Bourgogne-Franche-Comté": CHART_COLORS.palette[1],
  Bretagne: CHART_COLORS.palette[2],
  "Centre-Val de Loire": CHART_COLORS.palette[3],
  Corse: CHART_COLORS.palette[4],
  "Grand Est": CHART_COLORS.palette[5],
  "Hauts-de-France": CHART_COLORS.palette[6],
  "Île-de-France": CHART_COLORS.palette[7],
  Normandie: CHART_COLORS.palette[8],
  "Nouvelle-Aquitaine": CHART_COLORS.palette[9],
  Occitanie: CHART_COLORS.palette[10],
  "Pays de la Loire": CHART_COLORS.palette[11],
  "Provence-Alpes-Côte d'Azur": CHART_COLORS.primary,
  Guadeloupe: CHART_COLORS.secondary,
  Martinique: CHART_COLORS.tertiary,
  Guyane: CHART_COLORS.quaternary,
  "La Réunion": CHART_COLORS.palette[0],
  Mayotte: CHART_COLORS.palette[1],
};

const typeColors: Record<string, string> = {
  Université: CHART_COLORS.primary,
  "Grand établissement": CHART_COLORS.tertiary,
  "École d'ingénieurs": CHART_COLORS.secondary,
  "École normale supérieure": CHART_COLORS.quaternary,
  "Institut et école extérieurs aux universités": CHART_COLORS.palette[3],
  "Autre établissement": CHART_COLORS.palette[4],
};

export default function AdvancedScatterChart({
  data,
  xAxis,
  yAxis,
  sizeMetric,
  colorMetric,
  colorBy = "region",
}: AdvancedScatterChartProps) {
  const chartOptions = useMemo((): Highcharts.Options => {
    const getColor = (point: DataPoint): string => {
      if (colorBy === "region" && point.region) {
        return regionColors[point.region] || CHART_COLORS.palette[4];
      }
      if (colorBy === "type" && point.type) {
        return typeColors[point.type] || CHART_COLORS.palette[4];
      }
      if (colorBy === "metric" && colorMetric) {
        const value = point[colorMetric];
        if (typeof value === "number") {
          const normalized = Math.min(Math.max(value / 100, 0), 1);
          const r = Math.floor(255 * (1 - normalized));
          const g = Math.floor(255 * normalized);
          return `rgb(${r}, ${g}, 100)`;
        }
      }
      const typologies = [
        ...new Set(data.map((d) => d.etablissement_actuel_typologie)),
      ];
      const idx = typologies.indexOf(point.etablissement_actuel_typologie);
      const colors = CHART_COLORS.palette;
      return idx >= 0 ? colors[idx % colors.length] : CHART_COLORS.palette[4];
    };

    const series = data.map((point) => {
      const x = point[xAxis];
      const y = point[yAxis];
      const z = sizeMetric ? point[sizeMetric] : 100;

      return {
        x: typeof x === "number" ? x : 0,
        y: typeof y === "number" ? y : 0,
        z: typeof z === "number" ? z : 100,
        name: point.etablissement_actuel_lib,
        color: getColor(point),
        custom: {
          region: point.region,
          type: point.type,
          typologie: point.etablissement_actuel_typologie,
          colorMetricValue: colorMetric ? point[colorMetric] : null,
        },
      };
    });

    return {
      chart: {
        type: "bubble" as const,
        height: 600,
        backgroundColor: "transparent",
      },
      title: {
        text: undefined,
      },
      subtitle: {
        text: sizeMetric
          ? `Taille des bulles : ${metricLabels[sizeMetric] || sizeMetric}`
          : "Cliquez et glissez pour zoomer",
        style: { fontSize: "13px", color: DSFR_COLORS.textDefault },
      },
      xAxis: {
        title: {
          text: metricLabels[xAxis] || xAxis,
          style: { fontWeight: "bold" },
        },
        gridLineWidth: 1,
        gridLineColor: DSFR_COLORS.borderDefault,
      },
      yAxis: {
        title: {
          text: metricLabels[yAxis] || yAxis,
          style: { fontWeight: "bold" },
        },
        gridLineColor: "var(--border-default-grey)",
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        bubble: {
          minSize: 10,
          maxSize: 50,
          dataLabels: {
            enabled: false,
          },
        },
        series: {
          cursor: "pointer",
          point: {
            events: {
              click: function (this: any) {
                console.log("Clicked:", this.name);
              },
            },
          },
        },
      },
      tooltip: {
        useHTML: true,
        headerFormat: "<table>",
        pointFormat:
          '<tr><th colspan="2" style="font-weight: bold; padding-bottom: 5px;">{point.name}</th></tr>' +
          '<tr><td style="padding-right: 10px;"><strong>' +
          (metricLabels[xAxis] || xAxis) +
          ":</strong></td>" +
          '<td style="text-align: right;">{point.x:.2f}</td></tr>' +
          (yAxis !== xAxis
            ? '<tr><td style="padding-right: 10px;"><strong>' +
              (metricLabels[yAxis] || yAxis) +
              ":</strong></td>" +
              '<td style="text-align: right;">{point.y:.2f}</td></tr>'
            : "") +
          (sizeMetric && sizeMetric !== xAxis && sizeMetric !== yAxis
            ? '<tr><td style="padding-right: 10px;"><strong>' +
              (metricLabels[sizeMetric] || sizeMetric) +
              ":</strong></td>" +
              '<td style="text-align: right;">{point.z:.0f}</td></tr>'
            : "") +
          (colorMetric &&
          colorMetric !== xAxis &&
          colorMetric !== yAxis &&
          colorMetric !== sizeMetric
            ? '<tr><td style="padding-right: 10px;"><strong>' +
              (metricLabels[colorMetric] || colorMetric) +
              ":</strong></td>" +
              '<td style="text-align: right;">{point.custom.colorMetricValue:.2f}</td></tr>'
            : "") +
          '<tr><td style="padding-right: 10px;"><strong>Type:</strong></td>' +
          '<td style="text-align: right;">{point.custom.type}</td></tr>' +
          '<tr><td style="padding-right: 10px;"><strong>Région:</strong></td>' +
          '<td style="text-align: right;">{point.custom.region}</td></tr>',
        footerFormat: "</table>",
        followPointer: true,
      },
      series: [
        {
          type: "bubble" as const,
          name: "Établissements",
          data: series,
        },
      ] as Highcharts.SeriesOptionsType[],
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
    };
  }, [data, xAxis, yAxis, sizeMetric, colorMetric, colorBy]);

  const colorByLabel =
    colorBy === "region"
      ? "région"
      : colorBy === "type"
      ? "type"
      : colorBy === "typologie"
      ? "typologie"
      : "métrique";

  if (data.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée disponible pour cette analyse</p>
      </div>
    );
  }

  return (
    <ChartWrapper
      config={{
        id: "advanced-scatter-chart",
        idQuery: "advanced-scatter",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: `Analyse comparative : ${metricLabels[yAxis] || yAxis} vs ${
            metricLabels[xAxis] || xAxis
          }`,
        },
        comment: {
          fr: (
            <>
              Graphique à bulles comparant {data.length} établissements selon
              deux métriques. La taille des bulles représente{" "}
              {sizeMetric
                ? metricLabels[sizeMetric] || sizeMetric
                : "une valeur constante"}{" "}
              et la couleur indique {colorByLabel}.
            </>
          ),
        },
        readingKey: {
          fr: (
            <>
              Utilisez le zoom (cliquez-glissez) pour explorer les détails.
              Chaque bulle représente un établissement. Les axes montrent{" "}
              {metricLabels[xAxis] || xAxis} (horizontal) et{" "}
              {metricLabels[yAxis] || yAxis} (vertical).
            </>
          ),
        },
        updateDate: new Date(),
        integrationURL: "/integration-url",
      }}
      options={chartOptions}
      legend={null}
    />
  );
}

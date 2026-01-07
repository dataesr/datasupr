import { useMemo, useState } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createComparisonBarOptions } from "./options";

interface ComparisonBarChartProps {
  data: any[];
}

interface MetricOption {
  key: string;
  label: string;
  category: string;
  format?: (value: number) => string;
}

const METRIC_OPTIONS: MetricOption[] = [
  {
    key: "part_droits_d_inscription",
    label: "Droits d'inscription",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_formation_continue_diplomes_propres_et_vae",
    label: "Formation continue",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_taxe_d_apprentissage",
    label: "Taxe d'apprentissage",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_valorisation",
    label: "Valorisation",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_anr_hors_investissements_d_avenir",
    label: "ANR hors investissements d'avenir",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_anr_investissements_d_avenir",
    label: "ANR investissements d'avenir",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_contrats_et_prestations_de_recherche_hors_anr",
    label: "Contrats de recherche hors ANR",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_subventions_de_la_region",
    label: "Subventions de la région",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_subventions_union_europeenne",
    label: "Subventions Union Européenne",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_autres_ressources_propres",
    label: "Autres ressources propres",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "part_autres_subventions",
    label: "Autres subventions",
    category: "Ressources propres",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "ressources_propres",
    label: "Total ressources propres",
    category: "Valeurs absolues",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
  },
  {
    key: "ressources_propres_produits_encaissables",
    label: "Part des ressources propres / produits encaissables",
    category: "Ratios",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "charges_de_personnel_produits_encaissables",
    label: "Part des charges de personnel / produits encaissables",
    category: "Ratios",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "scsp_par_etudiants",
    label: "SCSP par étudiant",
    category: "Ratios",
    format: (v) => `${v.toLocaleString("fr-FR")} €`,
  },
  {
    key: "taux_encadrement",
    label: "Taux d'encadrement",
    category: "Ratios",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "scsp",
    label: "SCSP",
    category: "Valeurs absolues",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
  },
  {
    key: "produits_de_fonctionnement_encaissables",
    label: "Produits de fonctionnement encaissables",
    category: "Valeurs absolues",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
  },
  {
    key: "recettes_propres",
    label: "Recettes propres",
    category: "Valeurs absolues",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
  },
  {
    key: "charges_de_personnel",
    label: "Charges de personnel",
    category: "Valeurs absolues",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
  },
  {
    key: "effectif_sans_cpge",
    label: "Effectif étudiants (sans CPGE)",
    category: "Valeurs absolues",
    format: (v) => v.toLocaleString("fr-FR"),
  },
  {
    key: "emploi_etpt",
    label: "Emploi ETPT",
    category: "Valeurs absolues",
    format: (v) => v.toLocaleString("fr-FR"),
  },
];

export default function ComparisonBarChart({ data }: ComparisonBarChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>(
    "part_droits_d_inscription"
  );
  const [topN, setTopN] = useState<number>(20);

  const selectedMetricConfig = useMemo(
    () =>
      METRIC_OPTIONS.find((m) => m.key === selectedMetric) || METRIC_OPTIONS[0],
    [selectedMetric]
  );

  const chartOptions = useMemo(() => {
    if (!data || !data.length) return null;

    return createComparisonBarOptions(
      {
        metric: selectedMetric,
        metricLabel: selectedMetricConfig.label,
        topN,
        format: selectedMetricConfig.format,
      },
      data
    );
  }, [data, selectedMetric, topN, selectedMetricConfig]);

  const groupedMetrics = useMemo(() => {
    const groups: Record<string, MetricOption[]> = {};
    METRIC_OPTIONS.forEach((metric) => {
      if (!groups[metric.category]) {
        groups[metric.category] = [];
      }
      groups[metric.category].push(metric);
    });
    return groups;
  }, []);

  const config = {
    id: "comparison-bar",
    title: "",
  };

  return (
    <div>
      <Row gutters className="fr-mb-3w">
        <Col xs="12" md="8">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="select-metric">
              <strong>Métrique à comparer</strong>
              <span className="fr-hint-text">
                Choisissez la métrique à visualiser
              </span>
            </label>
            <select
              id="select-metric"
              className="fr-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {Object.entries(groupedMetrics).map(([category, metrics]) => (
                <optgroup key={category} label={category}>
                  {metrics.map((metric) => (
                    <option key={metric.key} value={metric.key}>
                      {metric.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </Col>
        <Col xs="12" md="4">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="select-top-n">
              <strong>Nombre d'établissements</strong>
              <span className="fr-hint-text">Afficher par</span>
            </label>
            <select
              id="select-top-n"
              className="fr-select"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </Col>
      </Row>

      {!chartOptions || !data || data.length === 0 ? (
        <div className="fr-alert fr-alert--warning">
          <p className="fr-alert__title">Aucune donnée disponible</p>
          <p>
            Aucun établissement ne dispose de données pour cette métrique avec
            les filtres sélectionnés.
          </p>
        </div>
      ) : (
        <ChartWrapper
          config={config}
          options={chartOptions}
          legend={null}
          hideTitle
        />
      )}
    </div>
  );
}

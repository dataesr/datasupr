import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col, Text } from "@dataesr/dsfr-plus";
import { createPositioningComparisonBarOptions } from "./options";
import { RenderData } from "./render-data";
import Dropdown from "../../../../../../../../components/dropdown";
import { Select } from "../../../../../../../../components/select";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";

interface PositioningComparisonBarChartProps {
  data: any[];
  currentStructureId?: string;
  currentStructureName?: string;
  selectedYear?: string;
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
    key: "part_ressources_propres",
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

export default function PositioningComparisonBarChart({
  data,
  currentStructureId,
  currentStructureName,
  selectedYear,
}: PositioningComparisonBarChartProps) {
  const [searchParams] = useSearchParams();
  const structureId = searchParams.get("structureId") || "";
  const positioningFilter = searchParams.get("positioningFilter") || "all";

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

    return createPositioningComparisonBarOptions(
      {
        metric: selectedMetric,
        metricLabel: selectedMetricConfig.label,
        topN,
        format: selectedMetricConfig.format,
      },
      data,
      currentStructureId,
      currentStructureName
    );
  }, [
    data,
    selectedMetric,
    topN,
    selectedMetricConfig,
    currentStructureId,
    currentStructureName,
  ]);

  const chartKey = useMemo(() => {
    if (!data || !Array.isArray(data))
      return `${selectedMetric}-${topN}-${currentStructureId}`;
    const dataIds = data
      .map((d) => d?.etablissement_id_paysage_actuel)
      .sort()
      .join(",");
    return `${selectedMetric}-${topN}-${currentStructureId}-${dataIds}`;
  }, [selectedMetric, topN, currentStructureId, data]);

  const groupedMetrics = useMemo(() => {
    if (!data || !Array.isArray(data)) return {};
    const availableMetrics = METRIC_OPTIONS.filter((metric) => {
      return data.some((item) => {
        const value = item[metric.key];
        return value != null && !isNaN(value) && value > 0;
      });
    });

    const groups: Record<string, MetricOption[]> = {};
    availableMetrics.forEach((metric) => {
      if (!groups[metric.category]) {
        groups[metric.category] = [];
      }
      groups[metric.category].push(metric);
    });
    return groups;
  }, [data]);

  const TOP_N_OPTIONS = [10, 20, 30, 50, 100];

  const config = {
    id: "positioning-comparison-bar",
    integrationURL: `/integration?chart_id=positioning-comparison-bar&structureId=${structureId}&year=${selectedYear}&metric=${selectedMetric}&topN=${topN}&filter=${positioningFilter}`,
    title: `${selectedMetricConfig.label}${selectedYear ? ` — ${selectedYear}` : ""}${currentStructureName ? ` — ${currentStructureName}` : ""}`,
  };

  return (
    <div>
      <Row gutters className="fr-mb-3w">
        <Col xs="12" md="8">
          <Text className="fr-text--sm fr-text--bold fr-mb-1w">
            Métrique à comparer
          </Text>
          <Dropdown
            label={selectedMetricConfig.label}
            icon="line-chart-line"
            size="sm"
            fullWidth
          >
            {Object.entries(groupedMetrics).map(([category, metrics]) => (
              <Dropdown.Group key={category} label={category}>
                {metrics.map((metric) => (
                  <Dropdown.Item
                    key={metric.key}
                    active={selectedMetric === metric.key}
                    onClick={() => setSelectedMetric(metric.key)}
                  >
                    {metric.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Group>
            ))}
          </Dropdown>
        </Col>
        <Col xs="12" md="4" className="text-right">
          <Text className="fr-text--sm  fr-text--bold fr-mb-1w">
            Nombre d'établissements
          </Text>
          <Select
            label={`${topN} établissements`}
            icon="list-ordered"
            size="sm"
          >
            {TOP_N_OPTIONS.map((n) => (
              <Select.Radio
                key={n}
                value={String(n)}
                checked={topN === n}
                onChange={() => setTopN(n)}
              >
                {n} établissements
              </Select.Radio>
            ))}
          </Select>
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
          key={chartKey}
          config={config}
          options={chartOptions}
          renderData={() => (
            <RenderData
              data={data}
              metric={selectedMetric}
              metricLabel={selectedMetricConfig.label}
              topN={topN}
              format={selectedMetricConfig.format}
              currentStructureId={currentStructureId}
              currentStructureName={currentStructureName}
            />
          )}
        />
      )}
    </div>
  );
}

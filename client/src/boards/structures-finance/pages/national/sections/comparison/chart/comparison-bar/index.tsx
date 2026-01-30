import { useMemo, useState } from "react";
import {
  Row,
  Col,
  SegmentedControl,
  SegmentedElement,
  Text,
} from "@dataesr/dsfr-plus";
import { createComparisonBarOptions } from "./options";
import { RenderData } from "./render-data";
import Dropdown from "../../../../../../../../components/dropdown";
import Select from "../../../../../../../../components/select";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";

interface ComparisonBarChartProps {
  data: any[];
  selectedYear?: string;
  selectedType?: string;
  selectedTypologie?: string;
  selectedRegion?: string;
  selectedMetric?: string;
  onMetricChange?: (metric: string) => void;
}

interface MetricOption {
  key: string;
  label: string;
  category: string;
  partKey?: string;
  partLabel?: string;
  format?: (value: number) => string;
  partFormat?: (value: number) => string;
}

const METRIC_OPTIONS: MetricOption[] = [
  {
    key: "droits_d_inscription",
    label: "Droits d'inscription",
    category: "Ressources propres",
    partKey: "part_droits_d_inscription",
    partLabel: "Part des droits d'inscription",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "formation_continue_diplomes_propres_et_vae",
    label: "Formation continue",
    category: "Ressources propres",
    partKey: "part_formation_continue_diplomes_propres_et_vae",
    partLabel: "Part de la formation continue",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "taxe_d_apprentissage",
    label: "Taxe d'apprentissage",
    category: "Ressources propres",
    partKey: "part_taxe_d_apprentissage",
    partLabel: "Part de la taxe d'apprentissage",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "valorisation",
    label: "Valorisation",
    category: "Ressources propres",
    partKey: "part_valorisation",
    partLabel: "Part de la valorisation",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "anr_hors_investissements_d_avenir",
    label: "ANR hors investissements d'avenir",
    category: "Ressources propres",
    partKey: "part_anr_hors_investissements_d_avenir",
    partLabel: "Part de l'ANR hors investissements d'avenir",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "anr_investissements_d_avenir",
    label: "ANR investissements d'avenir",
    category: "Ressources propres",
    partKey: "part_anr_investissements_d_avenir",
    partLabel: "Part de l'ANR investissements d'avenir",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "contrats_et_prestations_de_recherche_hors_anr",
    label: "Contrats de recherche hors ANR",
    category: "Ressources propres",
    partKey: "part_contrats_et_prestations_de_recherche_hors_anr",
    partLabel: "Part des contrats de recherche hors ANR",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "subventions_de_la_region",
    label: "Subventions de la région",
    category: "Ressources propres",
    partKey: "part_subventions_de_la_region",
    partLabel: "Part des subventions de la région",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "subventions_union_europeenne",
    label: "Subventions Union Européenne",
    category: "Ressources propres",
    partKey: "part_subventions_union_europeenne",
    partLabel: "Part des subventions UE",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "autres_ressources_propres",
    label: "Autres ressources propres",
    category: "Ressources propres",
    partKey: "part_autres_ressources_propres",
    partLabel: "Part des autres ressources propres",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "autres_subventions",
    label: "Autres subventions",
    category: "Ressources propres",
    partKey: "part_autres_subventions",
    partLabel: "Part des autres subventions",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
    partFormat: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: "ressources_propres",
    label: "Total ressources propres",
    category: "Valeurs absolues",
    format: (v) => `${(v / 1000000).toFixed(1)} M€`,
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
  // Ratios
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
];

export default function ComparisonBarChart({
  data,
  selectedYear,
  selectedType,
  selectedTypologie,
  selectedRegion,
  selectedMetric: selectedMetricProp,
  onMetricChange,
}: ComparisonBarChartProps) {
  const [internalMetric, setInternalMetric] = useState<string>(
    "droits_d_inscription"
  );
  const [topN, setTopN] = useState<number | null>(20);
  const [displayMode, setDisplayMode] = useState<"value" | "part">("value");

  const selectedMetric =
    selectedMetricProp && selectedMetricProp.trim() !== ""
      ? selectedMetricProp
      : internalMetric;

  const setSelectedMetric = (metric: string) => {
    setDisplayMode("value");
    if (onMetricChange) {
      onMetricChange(metric);
    } else {
      setInternalMetric(metric);
    }
  };

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedYear) parts.push(selectedYear);
    if (selectedType) parts.push(selectedType);
    if (selectedTypologie) parts.push(selectedTypologie);
    if (selectedRegion) parts.push(selectedRegion);
    return parts.length > 0 ? ` (${parts.join(" · ")})` : "";
  }, [selectedYear, selectedType, selectedTypologie, selectedRegion]);

  const selectedMetricConfig = useMemo(
    () =>
      METRIC_OPTIONS.find((m) => m.key === selectedMetric) || METRIC_OPTIONS[0],
    [selectedMetric]
  );

  const hasPart = !!selectedMetricConfig.partKey;

  const activeMetricKey = useMemo(() => {
    if (displayMode === "part" && selectedMetricConfig.partKey) {
      return selectedMetricConfig.partKey;
    }
    return selectedMetricConfig.key;
  }, [displayMode, selectedMetricConfig]);

  const activeMetricLabel = useMemo(() => {
    if (displayMode === "part" && selectedMetricConfig.partLabel) {
      return selectedMetricConfig.partLabel;
    }
    return selectedMetricConfig.label;
  }, [displayMode, selectedMetricConfig]);

  const activeFormat = useMemo(() => {
    if (displayMode === "part" && selectedMetricConfig.partFormat) {
      return selectedMetricConfig.partFormat;
    }
    return selectedMetricConfig.format;
  }, [displayMode, selectedMetricConfig]);

  const chartOptions = useMemo(() => {
    if (!data || !data.length) return null;

    return createComparisonBarOptions(
      {
        metric: activeMetricKey,
        metricLabel: activeMetricLabel,
        topN: topN ?? data.length,
        format: activeFormat,
      },
      data
    );
  }, [data, activeMetricKey, activeMetricLabel, topN, activeFormat]);

  const groupedMetrics = useMemo(() => {
    const groups: Record<string, MetricOption[]> = {};
    METRIC_OPTIONS.forEach((metric) => {
      const cat = metric.category;
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(metric);
    });
    return groups;
  }, []);

  const TOP_N_OPTIONS: (number | null)[] = [10, 20, 30, 50, 100, null];

  const config = {
    id: "comparison-bar",
    title: `${activeMetricLabel}${filterSummary}`,
  };

  const getTopNLabel = (n: number | null) =>
    n === null ? "Tous les établissements" : `${n} établissements`;

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
          <Text className="fr-text--sm fr-text--bold fr-mb-1w">
            Nombre d'établissements
          </Text>
          <Select label={getTopNLabel(topN)} icon="list-ordered" size="sm">
            {TOP_N_OPTIONS.map((n) => (
              <Select.Radio
                key={n ?? "all"}
                value={n === null ? "all" : String(n)}
                checked={topN === n}
                onChange={() => setTopN(n)}
              >
                {getTopNLabel(n)}
              </Select.Radio>
            ))}
          </Select>
        </Col>
      </Row>

      {hasPart && (
        <div className="fr-mb-2w">
          <SegmentedControl className="fr-segmented--sm" name="display-mode">
            <SegmentedElement
              checked={displayMode === "value"}
              label="Valeur"
              onClick={() => setDisplayMode("value")}
              value="value"
            />
            <SegmentedElement
              checked={displayMode === "part"}
              label="Part %"
              onClick={() => setDisplayMode("part")}
              value="part"
            />
          </SegmentedControl>
        </div>
      )}

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
          renderData={() => (
            <RenderData
              data={data}
              metric={activeMetricKey}
              metricLabel={activeMetricLabel}
              topN={topN ?? data.length}
              format={activeFormat}
            />
          )}
        />
      )}
    </div>
  );
}

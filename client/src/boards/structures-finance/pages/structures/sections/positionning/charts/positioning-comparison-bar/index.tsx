import { useMemo, useState } from "react";
import {
  Row,
  Col,
  Text,
  SegmentedControl,
  SegmentedElement,
} from "@dataesr/dsfr-plus";
import { createPositioningComparisonBarOptions } from "./options";
import { RenderData } from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import Select from "../../../../../../components/select";
import { useFinanceDefinitions } from "../../../../../definitions/api";
import {
  PREDEFINED_ANALYSES,
  METRICS_CONFIG,
  METRIC_TO_PART,
  type AnalysisKey,
  type MetricKey,
} from "../../../analyses/charts/evolution/config";
import {
  FINANCIAL_HEALTH_INDICATORS,
  ThresholdLegend,
  type ThresholdConfig,
} from "../../../../../../config/index";

interface PositioningComparisonBarChartProps {
  data?: any[];
  currentStructure?: any;
  currentStructureId?: string;
  currentStructureName?: string;
  selectedYear?: string;
  selectedAnalysis?: AnalysisKey | null;
}

export default function PositioningComparisonBarChart({
  data: propData,
  currentStructureId: propCurrentStructureId,
  currentStructureName: propCurrentStructureName,
  selectedYear: propSelectedYear,
  selectedAnalysis: propSelectedAnalysis,
}: PositioningComparisonBarChartProps) {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const [showPart, setShowPart] = useState(false);

  const data = propData || [];
  const currentStructureId = propCurrentStructureId;
  const currentStructureName = propCurrentStructureName || "";
  const year = propSelectedYear || "";
  const selectedAnalysis = propSelectedAnalysis || "ressources-total";

  const { data: definitionsData } = useFinanceDefinitions();

  const analysisConfig = selectedAnalysis
    ? PREDEFINED_ANALYSES[selectedAnalysis]
    : null;
  const isStacked = (analysisConfig as any)?.chartType === "stacked";

  const selectedMetric = useMemo(() => {
    if (!analysisConfig) return "effectif_sans_cpge";

    let baseMetric: MetricKey;

    if (isStacked) {
      const metrics = analysisConfig.metrics.filter(
        (metric) =>
          !metric.includes("_ipc") && metric !== "effectif_sans_cpge_veto"
      );
      baseMetric = (metrics[selectedMetricIndex] || metrics[0]) as MetricKey;
    } else {
      baseMetric = analysisConfig.metrics[0] as MetricKey;
    }

    // Si le mode est "part" et que la version part existe, utiliser celle-ci
    if (showPart) {
      const partMetric = METRIC_TO_PART[baseMetric];
      if (partMetric && METRICS_CONFIG[partMetric]) {
        const hasPartData = data.some((item: any) => {
          const value = item[partMetric];
          return value != null && value !== 0;
        });
        if (hasPartData) {
          return partMetric;
        }
      }
    }

    return baseMetric;
  }, [analysisConfig, isStacked, selectedMetricIndex, showPart, data]);

  const selectedMetricConfig = useMemo(() => {
    const config = METRICS_CONFIG[selectedMetric as MetricKey];
    if (!config) return METRICS_CONFIG["effectif_sans_cpge"];
    const cleanLabel = config.label.replace(/ à prix courant$/i, "");
    return { ...config, label: cleanLabel };
  }, [selectedMetric]);

  const metricLabel = useMemo(() => {
    if (!definitionsData || !selectedMetric) return selectedMetricConfig.label;

    for (const cat of definitionsData) {
      for (const sr of cat.sousRubriques) {
        const def = sr.definitions.find((d) => d.indicateur === selectedMetric);
        if (def?.libelle) {
          return def.libelle;
        }
      }
    }
    return selectedMetricConfig.label;
  }, [definitionsData, selectedMetric, selectedMetricConfig.label]);

  const hasPartVersion = useMemo(() => {
    if (!analysisConfig || !data || data.length === 0) return false;

    let baseMetric: MetricKey;
    if (isStacked) {
      const metrics = analysisConfig.metrics.filter(
        (metric) =>
          !metric.includes("_ipc") && metric !== "effectif_sans_cpge_veto"
      );
      baseMetric = (metrics[selectedMetricIndex] || metrics[0]) as MetricKey;
    } else {
      baseMetric = analysisConfig.metrics[0] as MetricKey;
    }

    const partMetric = METRIC_TO_PART[baseMetric];

    if (!partMetric || !METRICS_CONFIG[partMetric]) return false;

    return data.some((item: any) => {
      const value = item[partMetric];
      return value != null && value !== 0;
    });
  }, [isStacked, analysisConfig, selectedMetricIndex, data]);

  const metricThreshold = useMemo((): ThresholdConfig | null => {
    if (!definitionsData || !selectedMetric) return null;
    if (!FINANCIAL_HEALTH_INDICATORS.includes(selectedMetric)) return null;

    for (const cat of definitionsData) {
      for (const sr of cat.sousRubriques) {
        const def = sr.definitions.find((d) => d.indicateur === selectedMetric);
        if (
          def &&
          (def.ale_val != null || (def.vig_min != null && def.vig_max != null))
        ) {
          return {
            ale_sens: def.ale_sens,
            ale_val: def.ale_val,
            ale_lib: def.ale_lib,
            vig_min: def.vig_min,
            vig_max: def.vig_max,
            vig_lib: def.vig_lib,
          };
        }
      }
    }
    return null;
  }, [definitionsData, selectedMetric]);

  const formatValue = useMemo(() => {
    switch (selectedMetricConfig.format) {
      case "euro":
        return (v: number) => `${(v / 1000000).toFixed(1)} M€`;
      case "percent":
        return (v: number) => `${v.toFixed(1)}%`;
      case "number":
        return (v: number) => v.toLocaleString("fr-FR");
      case "decimal":
        return (v: number) => v.toFixed(1);
      default:
        return undefined;
    }
  }, [selectedMetricConfig.format]);

  const chartOptions = useMemo(() => {
    if (!data || !data.length) return null;

    return createPositioningComparisonBarOptions(
      {
        metric: selectedMetric,
        metricLabel: metricLabel,
        format: formatValue,
        threshold: metricThreshold,
      },
      data,
      currentStructureId,
      currentStructureName
    );
  }, [
    data,
    selectedMetric,
    metricLabel,
    formatValue,
    currentStructureId,
    currentStructureName,
    metricThreshold,
  ]);

  const chartKey = useMemo(() => {
    if (!data || !Array.isArray(data))
      return `${selectedAnalysis}-${currentStructureId}`;
    const dataIds = data
      .map((d) => d?.etablissement_id_paysage_actuel)
      .sort()
      .join(",");
    return `${selectedAnalysis}-${currentStructureId}-${dataIds}`;
  }, [selectedAnalysis, currentStructureId, data]);

  const config = {
    id: "positioning-comparison-bar",
    title: `${metricLabel}${year ? ` — ${year}` : ""}${currentStructureName ? ` — ${currentStructureName}` : ""}`,
  };

  return (
    <div>
      {isStacked && analysisConfig && (
        <Row gutters className="fr-mb-3w">
          <Col xs="12" md="6">
            <Text className="fr-text--sm fr-text--bold fr-mb-1w">Métrique</Text>
            <Select
              label={
                METRICS_CONFIG[
                  analysisConfig.metrics.filter(
                    (metric) =>
                      !metric.includes("_ipc") &&
                      metric !== "effectif_sans_cpge_veto"
                  )[selectedMetricIndex] as MetricKey
                ]?.label || "Sélectionner"
              }
              size="sm"
              fullWidth
              className="fr-mb-0"
            >
              {analysisConfig.metrics
                .filter(
                  (metric) =>
                    !metric.includes("_ipc") &&
                    metric !== "effectif_sans_cpge_veto"
                )
                .map((metric, index) => (
                  <Select.Checkbox
                    key={metric}
                    value={String(index)}
                    checked={selectedMetricIndex === index}
                    onChange={() => setSelectedMetricIndex(index)}
                  >
                    {METRICS_CONFIG[metric as MetricKey]?.label || metric}
                  </Select.Checkbox>
                ))}
            </Select>
          </Col>
        </Row>
      )}

      {hasPartVersion && (
        <Row gutters className="fr-mb-3w">
          <Col xs="12" md="6">
            <Text className="fr-text--sm fr-text--bold fr-mb-1w">
              Affichage
            </Text>
            <SegmentedControl
              className="fr-segmented--sm"
              name="positioning-part-mode"
            >
              <SegmentedElement
                checked={!showPart}
                label="Valeur"
                onClick={() => setShowPart(false)}
                value="value"
              />
              <SegmentedElement
                checked={showPart}
                label="%"
                onClick={() => setShowPart(true)}
                value="part"
              />
            </SegmentedControl>
          </Col>
        </Row>
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
          key={chartKey}
          config={config}
          options={chartOptions}
          legend={<ThresholdLegend threshold={metricThreshold} />}
          renderData={() => (
            <RenderData
              data={data}
              metric={selectedMetric}
              metricLabel={metricLabel}
              format={formatValue}
              currentStructureId={currentStructureId}
              currentStructureName={currentStructureName}
            />
          )}
        />
      )}
    </div>
  );
}

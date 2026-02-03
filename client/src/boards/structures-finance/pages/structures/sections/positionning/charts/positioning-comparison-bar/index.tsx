import { useMemo, useState } from "react";
import { Row, Col, Text } from "@dataesr/dsfr-plus";
import { createPositioningComparisonBarOptions } from "./options";
import { RenderData } from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import Select from "../../../../../../../../components/select";
import { useFinanceDefinitions } from "../../../../../definitions/api";
import {
  PREDEFINED_ANALYSES,
  METRICS_CONFIG,
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

    if (isStacked) {
      const metrics = analysisConfig.metrics.filter(
        (metric) =>
          !metric.includes("_ipc") && metric !== "effectif_sans_cpge_veto"
      );
      return (metrics[selectedMetricIndex] || metrics[0]) as MetricKey;
    }

    return analysisConfig?.metrics[0] || "effectif_sans_cpge";
  }, [analysisConfig, isStacked, selectedMetricIndex]);

  const selectedMetricConfig = useMemo(() => {
    const config = METRICS_CONFIG[selectedMetric as MetricKey];
    if (!config) return METRICS_CONFIG["effectif_sans_cpge"];
    const cleanLabel = config.label.replace(/ à prix courant$/i, "");
    return { ...config, label: cleanLabel };
  }, [selectedMetric]);

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
        metricLabel: selectedMetricConfig.label,
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
    selectedMetricConfig.label,
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
    title: `${selectedMetricConfig.label}${year ? ` — ${year}` : ""}${currentStructureName ? ` — ${currentStructureName}` : ""}`,
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
              metricLabel={selectedMetricConfig.label}
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

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
import { useMetricThreshold } from "../../../../../../hooks/useMetricThreshold";
import { useMetricLabel } from "../../../../../../hooks/useMetricLabel";
import {
  PREDEFINED_ANALYSES,
  METRICS_CONFIG,
  METRIC_TO_PART,
  type AnalysisKey,
  type MetricKey,
} from "../../../../../../config/config";
import { ThresholdLegend } from "../../../../../../config/index";
import MetricDefinitionsTable from "../../../../../../components/metric-definitions/metric-definitions-table";
import { BudgetWarning } from "../../../../../../components/budget-warning";

const filterDisplayMetrics = (metrics: readonly string[]) =>
  metrics.filter(
    (m) => !m.includes("_ipc") && m !== "effectif_sans_cpge_veto"
  ) as MetricKey[];

interface ComparisonBarChartProps {
  data?: any[];
  currentStructureId?: string;
  currentStructureName?: string;
  selectedYear?: string;
  selectedAnalysis?: AnalysisKey | null;
}

export default function ComparisonBarChart({
  data = [],
  currentStructureId,
  currentStructureName = "",
  selectedYear = "",
  selectedAnalysis = null,
}: ComparisonBarChartProps) {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const [showPart, setShowPart] = useState(false);

  const getMetricLabel = useMetricLabel();

  const analysisConfig = selectedAnalysis
    ? PREDEFINED_ANALYSES[selectedAnalysis]
    : null;
  const isStacked = (analysisConfig as any)?.chartType === "stacked";

  const displayMetrics = analysisConfig
    ? filterDisplayMetrics(analysisConfig.metrics)
    : [];

  const baseMetric = useMemo(() => {
    if (!analysisConfig) return "effectif_sans_cpge" as MetricKey;
    if (isStacked) {
      return (displayMetrics[selectedMetricIndex] ||
        displayMetrics[0]) as MetricKey;
    }
    return analysisConfig.metrics[0] as MetricKey;
  }, [analysisConfig, isStacked, displayMetrics, selectedMetricIndex]);

  const partMetric = METRIC_TO_PART[baseMetric];
  const hasPartVersion = useMemo(() => {
    if (!partMetric || !METRICS_CONFIG[partMetric] || !data?.length)
      return false;
    return data.some((item: any) => {
      const value = item[partMetric];
      return value != null && value !== 0;
    });
  }, [partMetric, data]);

  const selectedMetric: MetricKey =
    showPart && hasPartVersion && partMetric ? partMetric : baseMetric;

  const metricThreshold = useMetricThreshold(selectedMetric);
  const metricLabel = getMetricLabel(selectedMetric);
  const selectedMetricConfig =
    METRICS_CONFIG[selectedMetric] || METRICS_CONFIG["effectif_sans_cpge"];

  const chartOptions = useMemo(() => {
    if (!data?.length) return null;

    return createPositioningComparisonBarOptions(
      {
        metric: selectedMetric,
        metricLabel,
        metricConfig: selectedMetricConfig,
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
    selectedMetricConfig,
    metricThreshold,
    currentStructureId,
    currentStructureName,
  ]);

  const chartKey = useMemo(() => {
    if (!data || !Array.isArray(data))
      return `comparison-${currentStructureId}`;
    const dataIds = data
      .map((d) => d?.etablissement_id_paysage_actuel)
      .sort()
      .join(",");
    return `comparison-${currentStructureId}-${dataIds}`;
  }, [currentStructureId, data]);

  const chartConfig = {
    id: "positioning-comparison-bar",
    title: `${metricLabel}${selectedYear ? ` — ${selectedYear}` : ""}${currentStructureName ? ` — ${currentStructureName}` : ""}`,
  };

  return (
    <div>
      {isStacked && displayMetrics.length > 1 && (
        <Row gutters className="fr-mb-3w">
          <Col xs="12" md="6">
            <Text className="fr-text--sm fr-text--bold fr-mb-1w">Métrique</Text>
            <Select
              label={
                METRICS_CONFIG[displayMetrics[selectedMetricIndex] as MetricKey]
                  ?.label || "Sélectionner"
              }
              size="sm"
              fullWidth
              className="fr-mb-0"
            >
              {displayMetrics.map((metric, index) => (
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

      <BudgetWarning data={data} metrics={[selectedMetric]} />

      {!chartOptions || !data?.length ? (
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
          config={chartConfig}
          options={chartOptions}
          legend={<ThresholdLegend threshold={metricThreshold} />}
          renderData={() => (
            <RenderData
              data={data}
              metric={selectedMetric}
              metricLabel={metricLabel}
              metricConfig={selectedMetricConfig}
              currentStructureId={currentStructureId}
              currentStructureName={currentStructureName}
            />
          )}
        />
      )}

      <MetricDefinitionsTable metricKeys={displayMetrics} />
    </div>
  );
}

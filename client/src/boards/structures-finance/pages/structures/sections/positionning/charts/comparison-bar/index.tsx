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
import { useMetricSens } from "../../../../../../hooks/useMetricSens";
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
import {
  BUDGET_SENSITIVE_METRICS,
  BudgetWarning,
} from "../../../../../../components/budget-warning";
import { useComparisonFilters } from "../../hooks";
import ComparisonSummaryCard from "./comparison-summary-card";

const filterDisplayMetrics = (metrics: readonly string[]) =>
  metrics.filter(
    (m) => !m.includes("_ipc") && m !== "effectif_sans_cpge_veto"
  ) as MetricKey[];

interface ComparisonBarChartProps {
  data?: any[];
  allData?: any[];
  currentStructure?: any;
  currentStructureId?: string;
  currentStructureName?: string;
  selectedYear?: string;
  selectedAnalysis?: AnalysisKey | null;
  activeFilters?: {
    type?: string;
    typologie?: string;
    region?: string;
    rce?: string;
    devimmo?: string;
  };
}

export default function ComparisonBarChart({
  data = [],
  allData = [],
  currentStructure,
  currentStructureId,
  currentStructureName = "",
  selectedYear = "",
  selectedAnalysis = null,
  activeFilters = {},
}: ComparisonBarChartProps) {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const [showPart, setShowPart] = useState(false);

  const getMetricLabel = useMetricLabel();

  const { baseData, filterByCriteria, visibleCards } = useComparisonFilters(
    allData,
    currentStructure,
    currentStructureId,
    activeFilters
  );

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

  const metricSens = useMetricSens(selectedMetric);

  const metricThreshold = useMetricThreshold(selectedMetric);
  const metricLabel = getMetricLabel(selectedMetric);
  const selectedMetricConfig =
    METRICS_CONFIG[selectedMetric] || METRICS_CONFIG["effectif_sans_cpge"];

  const currentStructureHasData = useMemo(() => {
    if (!data?.length || !currentStructureId) return false;
    const currentStructureData = data.find(
      (item) => item.etablissement_id_paysage_actuel === currentStructureId
    );
    if (!currentStructureData) return false;
    const value = currentStructureData[selectedMetric];
    return value != null && value !== 0;
  }, [data, currentStructureId, selectedMetric]);

  const filteredData = useMemo(() => {
    if (!data?.length) return data;
    return data.filter((item) => {
      const value = item[selectedMetric];
      return value != null && !isNaN(value) && value !== 0;
    });
  }, [data, selectedMetric]);

  const chartOptions = useMemo(() => {
    if (!filteredData?.length) return null;

    return createPositioningComparisonBarOptions(
      {
        metric: selectedMetric,
        metricLabel,
        metricConfig: selectedMetricConfig,
        threshold: metricThreshold,
        sens: metricSens,
      },
      filteredData,
      currentStructureId,
      currentStructureName
    );
  }, [
    filteredData,
    selectedMetric,
    metricLabel,
    selectedMetricConfig,
    metricThreshold,
    metricSens,
    currentStructureId,
    currentStructureName,
  ]);

  const chartKey = useMemo(() => {
    if (!filteredData || !Array.isArray(filteredData))
      return `comparison-${currentStructureId}`;
    const dataIds = filteredData
      .map((d) => d?.etablissement_id_paysage_actuel)
      .sort()
      .join(",");
    return `comparison-${currentStructureId}-${dataIds}`;
  }, [currentStructureId, filteredData]);

  const isBudgetYear = useMemo(() => {
    if (!BUDGET_SENSITIVE_METRICS.has(selectedMetric)) return false;
    if (!data?.length || !currentStructureId) return false;
    const currentItem = data.find(
      (item) => item.etablissement_id_paysage_actuel === currentStructureId
    );
    return currentItem?.sanfin_source === "Budget";
  }, [selectedMetric, data, currentStructureId]);

  const formattedYear =
    selectedYear && isBudgetYear ? `${selectedYear} (Budget)` : selectedYear;

  const chartConfig = {
    id: "positioning-comparison-bar",
    title: `${metricLabel}${formattedYear ? ` — Exercice ${formattedYear}` : ""}${currentStructureName ? ` — ${currentStructureName}` : ""}`,
  };

  return (
    <div>
      {isStacked && displayMetrics.length > 1 && currentStructureHasData && (
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
      {currentStructureHasData && (
        <ComparisonSummaryCard
          allData={baseData}
          filterDataByCriteria={filterByCriteria}
          metric={selectedMetric}
          metricConfig={selectedMetricConfig}
          metricLabel={metricLabel}
          currentStructure={currentStructure}
          currentStructureId={currentStructureId}
          currentStructureName={currentStructureName}
          selectedYear={formattedYear}
          metricSens={metricSens}
          metricThreshold={metricThreshold}
          showAllCard={visibleCards.all}
          showRegionCard={visibleCards.region}
          showTypeCard={visibleCards.type}
          showTypologieCard={visibleCards.typologie}
        />
      )}

      {hasPartVersion && currentStructureHasData && (
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

      {!chartOptions || !filteredData?.length || !currentStructureHasData ? (
        <div className="fr-alert fr-alert--warning">
          <p className="fr-alert__title">Aucune donnée disponible</p>
          <p>
            Aucune donnée disponible pour{" "}
            {currentStructureName || "l'établissement"}
            {selectedYear ? ` en ${selectedYear}` : ""}.
          </p>
        </div>
      ) : (
        <>
          <ChartWrapper
            key={chartKey}
            config={chartConfig}
            options={chartOptions}
            legend={<ThresholdLegend threshold={metricThreshold} />}
            renderData={() => (
              <RenderData
                data={filteredData}
                metric={selectedMetric}
                metricLabel={metricLabel}
                metricConfig={selectedMetricConfig}
                metricSens={metricSens}
                currentStructureId={currentStructureId}
                currentStructureName={currentStructureName}
              />
            )}
          />

          <BudgetWarning data={data} metrics={[selectedMetric]} />
        </>
      )}

      <MetricDefinitionsTable metricKeys={displayMetrics} />
    </div>
  );
}

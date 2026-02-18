import { useMemo, useState } from "react";
import { Row, Col, Text } from "@dataesr/dsfr-plus";
import ComparisonBarChart from "./comparison-bar";
import ComparisonOverviewChart from "./comparison-overview";
import ScatterChart from "./scatter";
import AnalysisFilter from "../components/analysis-filter";
import Select from "../../../../../components/select";
import {
  PREDEFINED_ANALYSES,
  METRICS_CONFIG,
  type AnalysisKey,
  type MetricKey,
} from "../../../../../config/metrics-config";
import { useComparisonFilters } from "../hooks";
import { useMetricLabel } from "../../../../../hooks/useMetricLabel";
import { useMetricThreshold } from "../../../../../hooks/useMetricThreshold";
import { useMetricSens } from "../../../../../hooks/useMetricSens";

export type ChartView = "comparison" | "scatter-1" | "scatter-2" | "scatter-3";

const filterDisplayMetrics = (metrics: readonly string[]) =>
  metrics.filter(
    (m) => !m.includes("_ipc") && m !== "effectif_sans_cpge_veto"
  ) as MetricKey[];

interface PositioningChartsProps {
  activeChart: ChartView;
  data: any[];
  allData?: any[];
  currentStructure?: any;
  selectedYear?: string | number;
  selectedAnalysis: AnalysisKey | null;
  onSelectAnalysis?: (analysis: string | null) => void;
  activeFilters?: {
    type?: string;
    typologie?: string;
    region?: string;
    rce?: string;
    devimmo?: string;
  };
}

export default function PositioningCharts({
  activeChart,
  data,
  allData = [],
  currentStructure,
  selectedYear,
  selectedAnalysis,
  onSelectAnalysis,
  activeFilters = {},
}: PositioningChartsProps) {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const [showPart, setShowPart] = useState(false);

  const structureName =
    currentStructure?.etablissement_actuel_lib ||
    currentStructure?.etablissement_lib ||
    "l'établissement";

  const structureId = currentStructure?.etablissement_id_paysage_actuel;

  const getMetricLabel = useMetricLabel();

  const { baseData, filterByCriteria, visibleCards } = useComparisonFilters(
    allData,
    currentStructure,
    structureId,
    activeFilters
  );

  const analysisConfig = selectedAnalysis
    ? PREDEFINED_ANALYSES[selectedAnalysis]
    : null;
  const isStacked = (analysisConfig as any)?.chartType === "stacked";

  const displayMetrics = analysisConfig
    ? filterDisplayMetrics(analysisConfig.metrics)
    : [];

  const selectedMetric = useMemo(() => {
    if (!analysisConfig) return "effectif_sans_cpge" as MetricKey;
    if (isStacked) {
      return (displayMetrics[selectedMetricIndex] ||
        displayMetrics[0]) as MetricKey;
    }
    return analysisConfig.metrics[0] as MetricKey;
  }, [analysisConfig, isStacked, displayMetrics, selectedMetricIndex]);

  const selectedMetricConfig =
    METRICS_CONFIG[selectedMetric] || METRICS_CONFIG["effectif_sans_cpge"];
  const selectedMetricLabel = getMetricLabel(selectedMetric);
  const metricThreshold = useMetricThreshold(selectedMetric);
  const metricSens = useMetricSens(selectedMetric);

  if (activeChart === "comparison") {
    return (
      <div>
        <Row gutters>
          <Col xs="12" md="4">
            <AnalysisFilter
              data={data}
              selectedAnalysis={selectedAnalysis || "ressources-total"}
              onSelectAnalysis={onSelectAnalysis || (() => {})}
            />
          </Col>
          <Col xs="12" md="8">
            {isStacked && displayMetrics.length > 1 && (
              <Row gutters className="fr-mb-3w">
                <Col xs="12" md="6">
                  <Text className="fr-text--sm fr-text--bold fr-mb-1w">
                    Métrique
                  </Text>
                  <Select
                    label={
                      METRICS_CONFIG[
                        displayMetrics[selectedMetricIndex] as MetricKey
                      ]?.label || "Sélectionner"
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
            <ComparisonOverviewChart
              config={{
                metric: selectedMetric,
                metricLabel: selectedMetricLabel,
                format: selectedMetricConfig.format,
                threshold: metricThreshold,
                sens: metricSens,
                metricConfig: { year: String(selectedYear) },
              }}
              allData={baseData}
              filterDataByCriteria={filterByCriteria}
              currentStructure={currentStructure}
              currentStructureId={structureId}
              showAll={visibleCards.all}
              showRegion={visibleCards.region}
              showType={visibleCards.type}
              showTypologie={visibleCards.typologie}
              showPart={showPart}
              onShowPartChange={setShowPart}
            />
            <ComparisonBarChart
              data={data}
              currentStructureId={structureId}
              currentStructureName={structureName}
              selectedYear={String(selectedYear)}
              selectedMetric={selectedMetric}
              showPart={showPart}
              onShowPartChange={setShowPart}
            />
          </Col>
        </Row>
      </div>
    );
  }

  if (activeChart.startsWith("scatter-")) {
    return (
      <ScatterChart
        chartType={activeChart as "scatter-1" | "scatter-2" | "scatter-3"}
        data={data}
        currentStructureId={structureId}
        currentStructureName={structureName}
        selectedYear={selectedYear}
      />
    );
  }

  return null;
}

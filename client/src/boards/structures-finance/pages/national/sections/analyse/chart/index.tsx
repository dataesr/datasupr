import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import {
  Text,
  Row,
  Col,
  SegmentedControl,
  SegmentedElement,
} from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../components/chart-wrapper/index.tsx";
import { createComparisonBarOptions } from "./options.tsx";
import Select from "../../../../../components/select/index.tsx";
import DefaultSkeleton from "../../../../../../../components/charts-skeletons/default";
import MetricDefinitionsTable from "../../../../../components/metric-definitions/metric-definitions-table.tsx";
import { useMetricLabel } from "../../../../../hooks/useMetricLabel";
import { useMetricThreshold } from "../../../../../hooks/useMetricThreshold";
import {
  PREDEFINED_ANALYSES,
  METRICS_CONFIG,
  METRIC_TO_PART,
  type AnalysisKey,
  type MetricKey,
} from "../../../../../config/config.ts";
import { RenderData } from "./render-data.tsx";
import { ThresholdLegend } from "../../../../../config/index.tsx";
import { BudgetWarning } from "../../../../../components/budget-warning";

interface NationalChartProps {
  data: any[];
  selectedAnalysis: AnalysisKey;
  selectedYear: string;
  availableYears: number[];
  onYearChange: (year: string) => void;
  isLoading: boolean;
}

export default function NationalChart({
  data,
  selectedAnalysis,
  selectedYear,
  availableYears,
  onYearChange,
  isLoading,
}: NationalChartProps) {
  const [topN, setTopN] = useState<number | null>(20);
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const [showPart, setShowPart] = useState(false);

  const getMetricLabel = useMetricLabel();

  const analysisConfig = PREDEFINED_ANALYSES[selectedAnalysis];
  const isStacked = (analysisConfig as any)?.chartType === "stacked";

  const activeMetricKey = useMemo(() => {
    if (!analysisConfig) return null;

    let baseMetric: MetricKey;

    if (isStacked) {
      const metrics = analysisConfig.metrics.filter(
        (metric) =>
          !metric.includes("_ipc") && metric !== "effectif_sans_cpge_veto"
      );
      baseMetric = (metrics[selectedMetricIndex] || metrics[0]) as MetricKey;
    } else {
      const nonIpcMetric = analysisConfig.metrics.find(
        (metric) => !metric.includes("_ipc")
      );
      baseMetric = nonIpcMetric as MetricKey;
    }

    // Si le mode est "part" et que la version part existe, utiliser celle-ci
    if (showPart && baseMetric) {
      const partMetric = METRIC_TO_PART[baseMetric];
      if (partMetric && METRICS_CONFIG[partMetric]) {
        const hasPartData = data?.some((item: any) => {
          const value = item[partMetric];
          return value != null && value !== 0;
        });
        if (hasPartData) {
          return partMetric;
        }
      }
    }

    return baseMetric;
  }, [
    selectedAnalysis,
    analysisConfig,
    isStacked,
    selectedMetricIndex,
    showPart,
    data,
  ]);

  const metricThreshold = useMetricThreshold(activeMetricKey);

  const metricConfig = activeMetricKey
    ? METRICS_CONFIG[activeMetricKey as MetricKey]
    : null;

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
      const nonIpcMetric = analysisConfig.metrics.find(
        (metric) => !metric.includes("_ipc")
      );
      baseMetric = nonIpcMetric as MetricKey;
    }

    const partMetric = METRIC_TO_PART[baseMetric];

    if (!partMetric || !METRICS_CONFIG[partMetric]) return false;

    return data.some((item: any) => {
      const value = item[partMetric];
      return value != null && value !== 0;
    });
  }, [isStacked, analysisConfig, selectedMetricIndex, data]);

  const chartOptions: Highcharts.Options | null = useMemo(() => {
    if (!data || !data.length || !activeMetricKey || !metricConfig) return null;

    return createComparisonBarOptions(
      {
        metric: activeMetricKey,
        metricLabel: getMetricLabel(activeMetricKey),
        metricConfig,
        topN: topN ?? data.length,
        threshold: metricThreshold,
      },
      data
    );
  }, [
    data,
    activeMetricKey,
    metricConfig,
    topN,
    metricThreshold,
    getMetricLabel,
  ]);

  const TOP_N_OPTIONS: (number | null)[] = [10, 20, 30, 50, 100, null];

  const getTopNLabel = (n: number | null) =>
    n === null ? "Tous les établissements" : `${n} établissements`;

  const config = {
    id: "national-comparison",
    title: `${activeMetricKey ? getMetricLabel(activeMetricKey) : analysisConfig.label} (${selectedYear})`,
  };

  return (
    <div>
      <Row gutters className="fr-mb-3w">
        <Col xs="12" md="4">
          <Text className="fr-text--sm fr-text--bold fr-mb-1w">Année</Text>
          <Select label={selectedYear} size="sm" fullWidth className="fr-mb-0">
            {availableYears.map((year) => (
              <Select.Checkbox
                key={year}
                value={String(year)}
                checked={selectedYear === String(year)}
                onChange={() => onYearChange(String(year))}
              >
                {year}
              </Select.Checkbox>
            ))}
          </Select>
          {hasPartVersion && (
            <Row gutters className="fr-mt-2w">
              <Col xs="12" md="6">
                <Text className="fr-text--sm fr-text--bold fr-mb-1w">
                  Affichage
                </Text>
                <SegmentedControl
                  className="fr-segmented--sm"
                  name="national-part-mode"
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
        </Col>

        <Col xs="12" md="4" offsetMd="4">
          <Text className="fr-text--sm fr-text--bold fr-mb-1w">
            Nombre d'établissements
          </Text>
          <Select
            label={getTopNLabel(topN)}
            size="sm"
            fullWidth
            className="fr-mb-0"
          >
            {TOP_N_OPTIONS.map((n) => (
              <Select.Checkbox
                key={String(n)}
                value={String(n)}
                checked={topN === n}
                onChange={() => setTopN(n)}
              >
                {getTopNLabel(n)}
              </Select.Checkbox>
            ))}
          </Select>
        </Col>
      </Row>

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

      <BudgetWarning
        data={data}
        metrics={activeMetricKey ? [activeMetricKey] : []}
      />

      {isLoading ? (
        <div className="fr-text--center fr-py-5w">
          <DefaultSkeleton />
        </div>
      ) : !chartOptions || !data || data.length === 0 ? (
        <div className="fr-alert fr-alert--warning">
          <p className="fr-alert__title">Aucune donnée disponible</p>
          <p>
            Aucun établissement ne dispose de données pour cette métrique avec
            les filtres sélectionnés.
          </p>
        </div>
      ) : (
        <>
          <ChartWrapper
            config={config}
            options={chartOptions}
            legend={<ThresholdLegend threshold={metricThreshold} />}
            renderData={() => (
              <RenderData
                data={data}
                metric={activeMetricKey!}
                metricLabel={
                  activeMetricKey ? getMetricLabel(activeMetricKey) : ""
                }
                metricConfig={metricConfig!}
                topN={topN ?? data.length}
              />
            )}
          />
          <MetricDefinitionsTable
            metricKeys={activeMetricKey ? [activeMetricKey] : []}
          />
        </>
      )}
    </div>
  );
}

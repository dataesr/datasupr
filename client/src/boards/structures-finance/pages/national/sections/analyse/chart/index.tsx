import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import { Text, Row, Col } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../components/chart-wrapper/index.tsx";
import { createComparisonBarOptions } from "./options.tsx";
import Select from "../../../../../../../components/select/index.tsx";
import DefaultSkeleton from "../../../../../../../components/charts-skeletons/default";
import MetricDefinitionsTable from "../../../../../components/layouts/metric-definitions-table";
import { useFinanceDefinitions } from "../../../../definitions/api";
import {
  PREDEFINED_ANALYSES,
  METRICS_CONFIG,
  type AnalysisKey,
  type MetricKey,
} from "../../../../structures/sections/analyses/charts/evolution/config.ts";
import { RenderData } from "./render-data.tsx";
import {
  FINANCIAL_HEALTH_INDICATORS,
  ThresholdLegend,
  type ThresholdConfig,
} from "../../../../../config/index.tsx";

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

  const { data: definitionsData } = useFinanceDefinitions();

  const analysisConfig = PREDEFINED_ANALYSES[selectedAnalysis];
  const isStacked = (analysisConfig as any)?.chartType === "stacked";

  const activeMetricKey = useMemo(() => {
    if (!analysisConfig) return null;

    if (isStacked) {
      const metrics = analysisConfig.metrics.filter(
        (metric) =>
          !metric.includes("_ipc") && metric !== "effectif_sans_cpge_veto"
      );
      return (metrics[selectedMetricIndex] || metrics[0]) as MetricKey;
    }

    const nonIpcMetric = analysisConfig.metrics.find(
      (metric) => !metric.includes("_ipc")
    );

    return nonIpcMetric as MetricKey;
  }, [selectedAnalysis, analysisConfig, isStacked, selectedMetricIndex]);

  const metricConfig = activeMetricKey
    ? METRICS_CONFIG[activeMetricKey as MetricKey]
    : null;

  const metricThreshold = useMemo((): ThresholdConfig | null => {
    if (!definitionsData || !activeMetricKey) return null;
    if (!FINANCIAL_HEALTH_INDICATORS.includes(activeMetricKey)) return null;

    for (const cat of definitionsData) {
      for (const sr of cat.sousRubriques) {
        const def = sr.definitions.find(
          (d) => d.indicateur === activeMetricKey
        );
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
  }, [definitionsData, activeMetricKey]);

  const chartOptions: Highcharts.Options | null = useMemo(() => {
    if (!data || !data.length || !activeMetricKey) return null;

    const formatValue = (value: number): string => {
      if (!metricConfig) return String(value);

      switch (metricConfig.format) {
        case "euro":
          return `${(value / 1000000).toFixed(1)} M€`;
        case "number":
          return value.toLocaleString("fr-FR");
        case "percent":
          return `${value.toFixed(1)}%`;
        case "decimal":
          return value.toFixed(2);
        default:
          return String(value);
      }
    };

    return createComparisonBarOptions(
      {
        metric: activeMetricKey,
        metricLabel: metricConfig?.label || activeMetricKey,
        topN: topN ?? data.length,
        format: formatValue,
        threshold: metricThreshold,
      },
      data
    );
  }, [data, activeMetricKey, topN, metricConfig, metricThreshold]);

  const TOP_N_OPTIONS: (number | null)[] = [10, 20, 30, 50, 100, null];

  const getTopNLabel = (n: number | null) =>
    n === null ? "Tous les établissements" : `${n} établissements`;

  const config = {
    id: "national-comparison",
    title: `${analysisConfig.label} (${selectedYear})`,
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
                metricLabel={metricConfig?.label || activeMetricKey || ""}
                topN={topN ?? data.length}
                format={(value: number) => {
                  if (!metricConfig) return String(value);
                  switch (metricConfig.format) {
                    case "euro":
                      return `${(value / 1000000).toFixed(1)} M€`;
                    case "number":
                      return value.toLocaleString("fr-FR");
                    case "percent":
                      return `${value.toFixed(1)}%`;
                    case "decimal":
                      return value.toFixed(2);
                    default:
                      return String(value);
                  }
                }}
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

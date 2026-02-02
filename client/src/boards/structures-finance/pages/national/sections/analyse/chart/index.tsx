import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import { Text, Row, Col } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../components/chart-wrapper/index.tsx";
import { createComparisonBarOptions } from "./options.tsx";
import Select from "../../../../../../../components/select/index.tsx";
import {
  PREDEFINED_ANALYSES,
  METRICS_CONFIG,
  type AnalysisKey,
  type MetricKey,
} from "../../../../structures/sections/analyses/charts/evolution/config.ts";
import { RenderData } from "./render-data.tsx";

interface NationalChartProps {
  data: any[];
  selectedAnalysis: AnalysisKey;
  selectedYear?: string;
  selectedType?: string;
  selectedTypologie?: string;
  selectedRegion?: string;
}

export default function NationalChart({
  data,
  selectedAnalysis,
  selectedYear,
  selectedType,
  selectedTypologie,
  selectedRegion,
}: NationalChartProps) {
  const [topN, setTopN] = useState<number | null>(20);

  const analysisConfig = PREDEFINED_ANALYSES[selectedAnalysis];

  const activeMetricKey = useMemo(() => {
    if (!analysisConfig) return null;

    const nonIpcMetric = analysisConfig.metrics.find(
      (metric) => !metric.includes("_ipc")
    );

    return nonIpcMetric as MetricKey;
  }, [selectedAnalysis, analysisConfig]);

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedYear) parts.push(selectedYear);
    if (selectedType) parts.push(selectedType);
    if (selectedTypologie) parts.push(selectedTypologie);
    if (selectedRegion) parts.push(selectedRegion);
    return parts.length > 0 ? ` (${parts.join(" · ")})` : "";
  }, [selectedYear, selectedType, selectedTypologie, selectedRegion]);

  const metricConfig = activeMetricKey
    ? METRICS_CONFIG[activeMetricKey as MetricKey]
    : null;

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
      },
      data
    );
  }, [data, activeMetricKey, topN, metricConfig]);

  const TOP_N_OPTIONS: (number | null)[] = [10, 20, 30, 50, 100, null];

  const getTopNLabel = (n: number | null) =>
    n === null ? "Tous les établissements" : `${n} établissements`;

  const config = {
    id: "national-comparison",
    title: `${analysisConfig.label}${filterSummary}`,
  };

  return (
    <div>
      <Row gutters className="fr-mb-3w">
        <Col xs="12" md="4" offsetMd="8">
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
      )}
    </div>
  );
}

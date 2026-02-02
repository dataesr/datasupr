import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { createPositioningComparisonBarOptions } from "./options";
import { RenderData } from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
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
  data: any[];
  currentStructureId?: string;
  currentStructureName?: string;
  selectedYear?: string;
  selectedAnalysis: AnalysisKey | null;
  topN: number;
}

export default function PositioningComparisonBarChart({
  data,
  currentStructureId,
  currentStructureName,
  selectedYear,
  selectedAnalysis,
  topN,
}: PositioningComparisonBarChartProps) {
  const [searchParams] = useSearchParams();
  const structureId = searchParams.get("structureId") || "";
  const positioningFilter = searchParams.get("positioningFilter") || "all";

  const { data: definitionsData } = useFinanceDefinitions();

  const selectedMetric = useMemo(() => {
    if (!selectedAnalysis) return "effectif_sans_cpge";
    const analysis = PREDEFINED_ANALYSES[selectedAnalysis];
    return analysis?.metrics[0] || "effectif_sans_cpge";
  }, [selectedAnalysis]);

  const selectedMetricConfig = useMemo(() => {
    const config = METRICS_CONFIG[selectedMetric as MetricKey];
    if (!config) return METRICS_CONFIG["effectif_sans_cpge"];
    return config;
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

  const chartOptions = useMemo(() => {
    if (!data || !data.length) return null;

    const getFormat = () => {
      if (selectedMetricConfig.format === "euro") {
        return (v: number) => `${(v / 1000000).toFixed(1)} M€`;
      }
      if (selectedMetricConfig.format === "percent") {
        return (v: number) => `${v.toFixed(1)}%`;
      }
      if (selectedMetricConfig.format === "number") {
        return (v: number) => v.toLocaleString("fr-FR");
      }
      if (selectedMetricConfig.format === "decimal") {
        return (v: number) => v.toFixed(1);
      }
      return undefined;
    };

    return createPositioningComparisonBarOptions(
      {
        metric: selectedMetric,
        metricLabel: selectedMetricConfig.label,
        topN,
        format: getFormat(),
        threshold: metricThreshold,
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
    metricThreshold,
  ]);

  const chartKey = useMemo(() => {
    if (!data || !Array.isArray(data))
      return `${selectedAnalysis}-${topN}-${currentStructureId}`;
    const dataIds = data
      .map((d) => d?.etablissement_id_paysage_actuel)
      .sort()
      .join(",");
    return `${selectedAnalysis}-${topN}-${currentStructureId}-${dataIds}`;
  }, [selectedAnalysis, topN, currentStructureId, data]);

  const config = {
    id: "positioning-comparison-bar",
    integrationURL: `/integration?chart_id=positioning-comparison-bar&structureId=${structureId}&year=${selectedYear}&metric=${selectedMetric}&topN=${topN}&filter=${positioningFilter}`,
    title: `${selectedMetricConfig.label}${selectedYear ? ` — ${selectedYear}` : ""}${currentStructureName ? ` — ${currentStructureName}` : ""}`,
  };

  return (
    <div>
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
              topN={topN}
              format={
                selectedMetricConfig.format === "euro"
                  ? (v: number) => `${(v / 1000000).toFixed(1)} M€`
                  : selectedMetricConfig.format === "percent"
                    ? (v: number) => `${v.toFixed(1)}%`
                    : selectedMetricConfig.format === "number"
                      ? (v: number) => v.toLocaleString("fr-FR")
                      : selectedMetricConfig.format === "decimal"
                        ? (v: number) => v.toFixed(1)
                        : undefined
              }
              currentStructureId={currentStructureId}
              currentStructureName={currentStructureName}
            />
          )}
        />
      )}
    </div>
  );
}

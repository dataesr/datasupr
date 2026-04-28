import { useMemo } from "react";
import { useFinanceDefinitions } from "../api";
import { METRICS_CONFIG, type MetricKey } from "../config/metrics-config";
import {
  FINANCIAL_HEALTH_INDICATORS,
  type ThresholdConfig,
} from "../components/threshold/threshold-legend";
import type { MetricSens } from "../components/metric-sort";

function findDefinition(definitions: any[] | undefined, metricKey: string) {
  if (!definitions) return null;
  for (const cat of definitions) {
    for (const sr of cat.sousRubriques) {
      const def = sr.definitions.find((d: any) => d.indicateur === metricKey);
      if (def) return def;
    }
  }
  return null;
}

export function useMetricLabel() {
  const { data } = useFinanceDefinitions();
  return useMemo(
    () =>
      (metricKey: MetricKey): string => {
        const def = findDefinition(data, metricKey);
        return def?.libelle || METRICS_CONFIG[metricKey]?.label || metricKey;
      },
    [data]
  );
}

export function useMetricSens(
  metricKey: MetricKey | null | undefined
): MetricSens {
  const { data } = useFinanceDefinitions();
  if (!metricKey) return null;
  const def = findDefinition(data, metricKey);
  return def?.sens || null;
}

export function useMetricThreshold(
  metricKey: MetricKey | null | undefined
): ThresholdConfig | null {
  const { data } = useFinanceDefinitions();
  return useMemo(() => {
    if (!metricKey) return null;
    if (!FINANCIAL_HEALTH_INDICATORS.includes(metricKey)) return null;
    const def = findDefinition(data, metricKey);
    if (
      !def ||
      (def.ale_val == null && (def.vig_min == null || def.vig_max == null))
    )
      return null;
    return {
      ale_sens: def.ale_sens,
      ale_val: def.ale_val,
      ale_lib: def.ale_lib,
      vig_min: def.vig_min,
      vig_max: def.vig_max,
      vig_lib: def.vig_lib,
    };
  }, [data, metricKey]);
}

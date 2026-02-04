import { useMemo } from "react";
import { useFinanceDefinitions } from "../pages/definitions/api";
import {
  FINANCIAL_HEALTH_INDICATORS,
  type ThresholdConfig,
} from "../config/index";
import type { MetricKey } from "../config/config";

export function useMetricThreshold(
  metricKey: MetricKey | null | undefined
): ThresholdConfig | null {
  const { data: definitionsData } = useFinanceDefinitions();

  const metricThreshold = useMemo((): ThresholdConfig | null => {
    if (!definitionsData || !metricKey) return null;
    if (!FINANCIAL_HEALTH_INDICATORS.includes(metricKey)) return null;

    for (const cat of definitionsData) {
      for (const sr of cat.sousRubriques) {
        const def = sr.definitions.find((d) => d.indicateur === metricKey);
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
  }, [definitionsData, metricKey]);

  return metricThreshold;
}

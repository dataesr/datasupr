import { useMemo } from "react";
import { useFinanceDefinitions } from "../pages/definitions/api";
import { METRICS_CONFIG, type MetricKey } from "../config/config";

export function useMetricLabel() {
  const { data: definitionsData } = useFinanceDefinitions();

  const getMetricLabel = useMemo(() => {
    return (metricKey: MetricKey): string => {
      if (!definitionsData) {
        return METRICS_CONFIG[metricKey]?.label || metricKey;
      }

      for (const cat of definitionsData) {
        for (const sr of cat.sousRubriques) {
          const def = sr.definitions.find((d) => d.indicateur === metricKey);
          if (def?.libelle) {
            return def.libelle;
          }
        }
      }

      return METRICS_CONFIG[metricKey]?.label || metricKey;
    };
  }, [definitionsData]);

  return getMetricLabel;
}

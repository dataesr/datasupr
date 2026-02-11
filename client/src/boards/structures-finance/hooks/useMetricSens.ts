import { useMemo } from "react";
import { useFinanceDefinitions } from "../pages/definitions/api";
import type { MetricKey } from "../config/config";
import type { MetricSens } from "../components/metric-sort";

/**
 * Récupère le sens (augmentation/diminution) d'un indicateur depuis les définitions API.
 * Le sens détermine l'ordre de classement : valeurs élevées ou basses = meilleures.
 */
export function useMetricSens(
  metricKey: MetricKey | null | undefined
): MetricSens {
  const { data: definitions } = useFinanceDefinitions();

  return useMemo(() => {
    if (!definitions || !metricKey) return null;

    for (const category of definitions) {
      for (const sousRubrique of category.sousRubriques) {
        const def = sousRubrique.definitions.find(
          (d) => d.indicateur === metricKey
        );
        if (def) return def.sens || null;
      }
    }

    return null;
  }, [definitions, metricKey]);
}

import { BUDGET_SENSITIVE_METRICS } from "../budget-warning/budgetIndicators";
import { useMetricEvolution } from "../../pages/structures/sections/api";

export function useBudgetInfo(metrics: string[]) {
  const hasSensitiveMetric = metrics.some((metric) =>
    BUDGET_SENSITIVE_METRICS.has(metric)
  );

  if (!hasSensitiveMetric) {
    return { hasBudgetData: false, budgetYears: [] };
  }

  const evolutionDataList = metrics
    .filter((metric) => BUDGET_SENSITIVE_METRICS.has(metric))
    .map((metric) => useMetricEvolution(metric))
    .filter((data) => data && data.length > 0);

  const hasBudgetData = evolutionDataList.some((evolutionData) =>
    evolutionData?.some((item: any) => item.sanfin_source === "Budget")
  );

  if (!hasBudgetData) {
    return { hasBudgetData: false, budgetYears: [] };
  }

  const budgetYears = Array.from(
    new Set(
      evolutionDataList.flatMap(
        (evolutionData) =>
          evolutionData
            ?.filter((item: any) => item.sanfin_source === "Budget")
            .map((item: any) => item.exercice || item.anuniv)
            .filter((year: any) => year != null) || []
      )
    )
  ).sort((a: any, b: any) => a - b);

  return {
    hasBudgetData: budgetYears.length > 0,
    budgetYears,
  };
}

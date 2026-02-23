import { BUDGET_SENSITIVE_METRICS } from "../budget-warning/budgetIndicators";
import { useMetricEvolution } from "../../pages/structures/sections/api";

interface SectionBudgetWarningProps {
  metrics: string[];
}

export function SectionBudgetWarning({ metrics }: SectionBudgetWarningProps) {
  const hasSensitiveMetric = metrics.some((metric) =>
    BUDGET_SENSITIVE_METRICS.has(metric)
  );

  if (!hasSensitiveMetric) {
    return null;
  }

  const evolutionDataList = metrics
    .filter((metric) => BUDGET_SENSITIVE_METRICS.has(metric))
    .map((metric) => useMetricEvolution(metric))
    .filter((data) => data && data.length > 0);

  const hasBudgetData = evolutionDataList.some((evolutionData) =>
    evolutionData?.some((item: any) => item.sanfin_source === "Budget")
  );

  if (!hasBudgetData) {
    return null;
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

  if (budgetYears.length === 0) {
    return null;
  }

  return (
    <div className="fr-callout fr-mb-4w">
      <h3 className="fr-callout__title">Point d'attention</h3>
      <p className="fr-callout__text fr-text--sm">
        <strong>Données budgétaires</strong>
        <br />
        Certaines données de{" "}
        {budgetYears.length === 1 ? "l'année" : "des années"}{" "}
        <strong>{budgetYears.join(", ")}</strong> présentées sur cette page sont
        des données budgétaires qui correspondent à des prévisions ou des
        objectifs financiers établis par l'établissement. Elles ne reflètent pas
        nécessairement les réalisations effectives.
      </p>
    </div>
  );
}

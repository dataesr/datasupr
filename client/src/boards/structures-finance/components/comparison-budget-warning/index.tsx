import {
  hasBudgetData,
  getBudgetYears,
} from "../budget-warning/budgetIndicators";

interface ComparisonBudgetWarningProps {
  data: any[];
  metrics: readonly string[];
}

export function ComparisonBudgetWarning({
  data,
  metrics,
}: ComparisonBudgetWarningProps) {
  if (!hasBudgetData(data, metrics)) {
    return null;
  }

  const budgetYears = getBudgetYears(data);

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
        objectifs financiers établis par l'établissement et votés en conseil
        d'administration. Elles ne reflètent pas nécessairement les réalisations
        effectives.
      </p>
    </div>
  );
}

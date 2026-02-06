import { Text } from "@dataesr/dsfr-plus";
import { hasBudgetData, getBudgetYears } from "./budgetIndicators";

interface BudgetWarningProps {
  data: any[] | undefined;
  metrics: string[];
}

export function BudgetWarning({ data, metrics }: BudgetWarningProps) {
  const showWarning = hasBudgetData(data, metrics);

  if (!showWarning) return null;

  const budgetYears = getBudgetYears(data);

  if (budgetYears.length === 0) return null;

  return (
    <div className="fr-alert fr-alert--info fr-mb-2w">
      <p className="fr-alert__title">Données budgétaires</p>
      <Text>
        Les données pour {budgetYears.length === 1 ? "l'année" : "les années"}{" "}
        <strong>{budgetYears.join(", ")}</strong> proviennent du budget et
        peuvent différer des données comptables définitives.
      </Text>
    </div>
  );
}

import { useMemo } from "react";
import { useFinanceAdvancedComparison } from "../../../api";

export function useEtablissementsData(selectedYear: string | number) {
  const { data: comparisonData, isLoading } = useFinanceAdvancedComparison(
    {
      annee: String(selectedYear),
      type: "",
      typologie: "",
      region: "",
    },
    !!selectedYear
  );

  const allEtablissements = useMemo(() => {
    if (!comparisonData || !comparisonData.items) return [];

    let etabs = comparisonData.items;

    const etabsMap = new Map();
    etabs.forEach((etab: any) => {
      const currentId =
        etab.etablissement_id_paysage_actuel ||
        etab.etablissement_id_paysage ||
        etab.id;
      if (!currentId) return;

      const existing = etabsMap.get(currentId);
      if (
        !existing ||
        etab.etablissement_id_paysage === etab.etablissement_id_paysage_actuel
      ) {
        etabsMap.set(currentId, etab);
      }
    });

    etabs = Array.from(etabsMap.values());

    return etabs;
  }, [comparisonData]);

  return {
    allEtablissements,
    isLoading,
  };
}

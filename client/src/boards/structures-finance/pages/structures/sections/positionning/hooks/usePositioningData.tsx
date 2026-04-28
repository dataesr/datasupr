import { useMemo } from "react";
import { useFinanceAdvancedComparison } from "../../../../../api";
import { deduplicateEtablissements } from "../../../api";

export interface PositioningFilters {
  type?: string;
  typologie?: string;
  region?: string;
  rce?: string;
  devimmo?: string;
}

export function usePositioningData(
  selectedYear: string | number | undefined,
  currentStructure: any,
  filters: PositioningFilters
) {
  const { data: comparisonData, isLoading } = useFinanceAdvancedComparison(
    { annee: String(selectedYear), type: "", typologie: "", region: "" },
    !!selectedYear
  );

  const allItems = useMemo(
    () => deduplicateEtablissements(comparisonData?.items ?? []),
    [comparisonData]
  );

  const filteredItems = useMemo(() => {
    const structureId = currentStructure?.etablissement_id_paysage_actuel;

    return allItems.filter((item) => {
      const itemId = item.etablissement_id_paysage_actuel;
      if (structureId && itemId === structureId) return true;

      if (filters.type === "same-type") {
        const itemType = item.etablissement_actuel_type || item.type;
        const currentType =
          currentStructure?.etablissement_actuel_type || currentStructure?.type;
        if (itemType !== currentType) return false;
      }

      if (filters.typologie === "same-typologie") {
        const itemTypo = item.etablissement_actuel_typologie || item.typologie;
        const currentTypo =
          currentStructure?.etablissement_actuel_typologie ||
          currentStructure?.typologie;
        if (itemTypo !== currentTypo) return false;
      }

      if (filters.region === "same-region") {
        const itemRegion = item.etablissement_actuel_region || item.region;
        const currentRegion =
          currentStructure?.etablissement_actuel_region ||
          currentStructure?.region;
        if (itemRegion !== currentRegion) return false;
      }

      if (filters.rce === "rce" && item.is_rce !== true) return false;
      if (filters.rce === "non-rce" && item.is_rce === true) return false;

      if (filters.devimmo === "devimmo" && item.is_devimmo !== true)
        return false;
      if (filters.devimmo === "non-devimmo" && item.is_devimmo === true)
        return false;

      return true;
    });
  }, [allItems, currentStructure, filters]);

  return { allItems, filteredItems, isLoading };
}

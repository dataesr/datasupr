import { useMemo } from "react";

type FilterMode = "all" | "same-type" | "same-typologie" | "same-region";

export function usePositioningFilteredData(
  allData: any[],
  currentStructure: any,
  filterMode: FilterMode
) {
  return useMemo(() => {
    const structureId = currentStructure?.etablissement_id_paysage_actuel;

    const filtered = allData.filter((item) => {
      const itemId = item.etablissement_id_paysage_actuel;

      if (structureId && itemId === structureId) {
        return true;
      }

      switch (filterMode) {
        case "same-type":
          return (
            item.etablissement_actuel_type ===
              currentStructure?.etablissement_actuel_type ||
            item.type === currentStructure?.type
          );
        case "same-typologie":
          return (
            item.etablissement_actuel_typologie ===
              currentStructure?.etablissement_actuel_typologie ||
            item.typologie === currentStructure?.typologie
          );
        case "same-region":
          return (
            item.etablissement_actuel_region ===
              currentStructure?.etablissement_actuel_region ||
            item.region === currentStructure?.region
          );
        case "all":
        default:
          return true;
      }
    });

    return filtered;
  }, [allData, currentStructure, filterMode]);
}

export type { FilterMode };

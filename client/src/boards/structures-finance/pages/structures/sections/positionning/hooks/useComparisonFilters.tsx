import { useMemo } from "react";

interface ActiveFilters {
  type?: string;
  typologie?: string;
  region?: string;
  rce?: string;
  devimmo?: string;
}

export function useComparisonFilters(
  allData: any[],
  currentStructure: any,
  currentStructureId?: string,
  activeFilters: ActiveFilters = {}
) {
  const baseData = useMemo(() => {
    if (!allData?.length) return allData;
    return allData.filter((item) => {
      const itemId = item.etablissement_id_paysage_actuel;
      if (currentStructureId && itemId === currentStructureId) return true;
      if (activeFilters.rce === "rce" && item.is_rce !== true) return false;
      if (activeFilters.rce === "non-rce" && item.is_rce === true) return false;
      if (activeFilters.devimmo === "devimmo" && item.is_devimmo !== true)
        return false;
      if (activeFilters.devimmo === "non-devimmo" && item.is_devimmo === true)
        return false;
      return true;
    });
  }, [allData, activeFilters.rce, activeFilters.devimmo, currentStructureId]);

  const filterByCriteria = useMemo(() => {
    return (criterion: "type" | "typologie" | "region") => {
      if (!baseData?.length || !currentStructure) return [];

      return baseData.filter((item) => {
        const itemId = item.etablissement_id_paysage_actuel;
        if (currentStructureId && itemId === currentStructureId) return true;

        if (criterion === "type") {
          const itemType = item.etablissement_actuel_type || item.type;
          const currentType =
            currentStructure?.etablissement_actuel_type ||
            currentStructure?.type;
          return itemType === currentType;
        }

        if (criterion === "typologie") {
          const itemTypo =
            item.etablissement_actuel_typologie || item.typologie;
          const currentTypo =
            currentStructure?.etablissement_actuel_typologie ||
            currentStructure?.typologie;
          return itemTypo === currentTypo;
        }

        if (criterion === "region") {
          const itemRegion = item.etablissement_actuel_region || item.region;
          const currentRegion =
            currentStructure?.etablissement_actuel_region ||
            currentStructure?.region;
          return itemRegion === currentRegion;
        }

        return false;
      });
    };
  }, [baseData, currentStructure, currentStructureId]);

  const visibleCards = useMemo(() => {
    const hasTypeFilter = activeFilters.type === "same-type";
    const hasTypologieFilter = activeFilters.typologie === "same-typologie";
    const hasRegionFilter = activeFilters.region === "same-region";
    const hasAnyFilter = hasTypeFilter || hasTypologieFilter || hasRegionFilter;

    return {
      all: !hasAnyFilter,
      region: !hasAnyFilter || hasRegionFilter,
      type: !hasAnyFilter || hasTypeFilter,
      typologie: !hasAnyFilter || hasTypologieFilter,
    };
  }, [activeFilters.type, activeFilters.typologie, activeFilters.region]);

  return {
    baseData,
    filterByCriteria,
    visibleCards,
  };
}

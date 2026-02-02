import { useMemo } from "react";

export interface PositioningFilters {
  type?: string;
  typologie?: string;
  region?: string;
  rce?: string;
  devimmo?: string;
}

export function usePositioningFilteredData(
  allData: any[],
  currentStructure: any,
  filters: PositioningFilters
) {
  return useMemo(() => {
    const structureId = currentStructure?.etablissement_id_paysage_actuel;

    const filtered = allData.filter((item) => {
      const itemId = item.etablissement_id_paysage_actuel;

      // Toujours inclure l'établissement actuel
      if (structureId && itemId === structureId) {
        return true;
      }

      if (filters.type) {
        const itemType = item.etablissement_actuel_type || item.type;
        const currentType =
          currentStructure?.etablissement_actuel_type || currentStructure?.type;
        if (filters.type === "same-type" && itemType !== currentType) {
          return false;
        }
      }

      if (filters.typologie) {
        const itemTypo = item.etablissement_actuel_typologie || item.typologie;
        const currentTypo =
          currentStructure?.etablissement_actuel_typologie ||
          currentStructure?.typologie;
        if (
          filters.typologie === "same-typologie" &&
          itemTypo !== currentTypo
        ) {
          return false;
        }
      }

      if (filters.region) {
        const itemRegion = item.etablissement_actuel_region || item.region;
        const currentRegion =
          currentStructure?.etablissement_actuel_region ||
          currentStructure?.region;
        if (filters.region === "same-region" && itemRegion !== currentRegion) {
          return false;
        }
      }

      if (filters.rce) {
        if (filters.rce === "rce" && item.is_rce !== true) {
          return false;
        }
        if (filters.rce === "non-rce" && item.is_rce === true) {
          return false;
        }
      }

      if (filters.devimmo) {
        if (filters.devimmo === "devimmo" && item.is_devimmo !== true) {
          return false;
        }
        if (filters.devimmo === "non-devimmo" && item.is_devimmo === true) {
          return false;
        }
      }

      return true;
    });

    return filtered;
  }, [allData, currentStructure, filters]);
}

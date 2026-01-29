import { useMemo } from "react";

export const isRce = (item: any): boolean => item.is_rce === true;

export function useFilteredNationalData(
  allItems: any[],
  selectedType: string,
  selectedTypologie: string,
  selectedRegion: string,
  selectedRce: string = ""
) {
  return useMemo(() => {
    return allItems.filter((item: any) => {
      if (selectedType && item.etablissement_actuel_type !== selectedType)
        return false;
      if (
        selectedTypologie &&
        item.etablissement_actuel_typologie !== selectedTypologie
      )
        return false;
      if (selectedRegion && item.etablissement_actuel_region !== selectedRegion)
        return false;
      if (selectedRce === "rce" && !isRce(item)) return false;
      if (selectedRce === "non-rce" && isRce(item)) return false;
      return true;
    });
  }, [allItems, selectedType, selectedTypologie, selectedRegion, selectedRce]);
}

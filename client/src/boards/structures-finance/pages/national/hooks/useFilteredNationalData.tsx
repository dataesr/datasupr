import { useMemo } from "react";
import { matchRce, matchDevimmo } from "../../../utils/predicates";

export function useFilteredNationalData(
  allItems: any[],
  selectedType: string,
  selectedTypologie: string,
  selectedRegion: string,
  selectedRce: string = "",
  selectedDevimmo: string = ""
) {
  return useMemo(() => {
    const rce = matchRce(selectedRce);
    const devimmo = matchDevimmo(selectedDevimmo);
    return allItems.filter((item: any) => {
      if (selectedType && item.type !== selectedType) return false;
      if (
        selectedTypologie &&
        item.etablissement_categorie !== selectedTypologie
      )
        return false;
      if (selectedRegion && item.region !== selectedRegion) return false;
      if (!rce(item)) return false;
      if (!devimmo(item)) return false;
      return true;
    });
  }, [
    allItems,
    selectedType,
    selectedTypologie,
    selectedRegion,
    selectedRce,
    selectedDevimmo,
  ]);
}

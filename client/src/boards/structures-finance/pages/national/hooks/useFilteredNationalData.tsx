import { useMemo } from "react";

export const isRce = (item: any): boolean => item.is_rce === true;
export const isDevimmo = (item: any): boolean => item.is_devimmo === true;

export function useFilteredNationalData(
  allItems: any[],
  selectedType: string,
  selectedTypologie: string,
  selectedRegion: string,
  selectedRce: string = "",
  selectedDevimmo: string = ""
) {
  return useMemo(() => {
    return allItems.filter((item: any) => {
      if (selectedType && item.type !== selectedType) return false;
      if (selectedTypologie && item.typologie !== selectedTypologie)
        return false;
      if (selectedRegion && item.region !== selectedRegion) return false;
      if (selectedRce === "rce" && !isRce(item)) return false;
      if (selectedRce === "non-rce" && isRce(item)) return false;
      if (selectedDevimmo === "devimmo" && !isDevimmo(item)) return false;
      if (selectedDevimmo === "non-devimmo" && isDevimmo(item)) return false;
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

import { useMemo } from "react";

export function useFilteredNationalData(
  allItems: any[],
  selectedType: string,
  selectedTypologie: string,
  selectedRegion: string
) {
  return useMemo(() => {
    let items = allItems;

    if (selectedType) {
      items = items.filter((item: any) => item.type === selectedType);
    }
    if (selectedTypologie) {
      items = items.filter(
        (item: any) => item.etablissement_actuel_typologie === selectedTypologie
      );
    }
    if (selectedRegion) {
      items = items.filter((item: any) => item.region === selectedRegion);
    }

    return items;
  }, [allItems, selectedType, selectedTypologie, selectedRegion]);
}

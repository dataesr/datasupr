import { useMemo } from "react";

export function useNationalFilters(
  allItems: any[],
  selectedType: string,
  selectedTypologie: string,
  selectedRegion: string
) {
  const availableTypes = useMemo(() => {
    if (!allItems.length) return [];

    let itemsToConsider = allItems;

    if (selectedTypologie) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.etablissement_categorie === selectedTypologie
      );
    }
    if (selectedRegion) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.region === selectedRegion
      );
    }

    const types = new Set<string>();
    itemsToConsider.forEach((item: any) => {
      if (item.type) types.add(item.type);
    });

    return Array.from(types).sort((a, b) => {
      const aIsUniv =
        a.toLowerCase().includes("université") ||
        a.toLowerCase().includes("universite");
      const bIsUniv =
        b.toLowerCase().includes("université") ||
        b.toLowerCase().includes("universite");

      if (aIsUniv && !bIsUniv) return -1;
      if (!aIsUniv && bIsUniv) return 1;

      return a.localeCompare(b, "fr", { sensitivity: "base" });
    });
  }, [allItems, selectedTypologie, selectedRegion]);

  const availableTypologies = useMemo(() => {
    if (!allItems.length) return [];

    let itemsToConsider = allItems;

    if (selectedType) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.type === selectedType
      );
    }
    if (selectedRegion) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.region === selectedRegion
      );
    }

    const typologies = new Set<string>();
    itemsToConsider.forEach((item: any) => {
      if (item.etablissement_categorie)
        typologies.add(item.etablissement_categorie);
    });

    return Array.from(typologies).sort((a, b) => {
      const aIsUniv =
        a.toLowerCase().includes("université") ||
        a.toLowerCase().includes("universite");
      const bIsUniv =
        b.toLowerCase().includes("université") ||
        b.toLowerCase().includes("universite");

      if (aIsUniv && !bIsUniv) return -1;
      if (!aIsUniv && bIsUniv) return 1;

      return a.localeCompare(b, "fr", { sensitivity: "base" });
    });
  }, [allItems, selectedType, selectedRegion]);

  const availableRegions = useMemo(() => {
    if (!allItems.length) return [];

    let itemsToConsider = allItems;

    if (selectedType) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.type === selectedType
      );
    }
    if (selectedTypologie) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.etablissement_categorie === selectedTypologie
      );
    }

    const regions = new Set<string>();
    itemsToConsider.forEach((item: any) => {
      if (item.region) regions.add(item.region);
    });

    return Array.from(regions).sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" })
    );
  }, [allItems, selectedType, selectedTypologie]);

  return {
    availableTypes,
    availableTypologies,
    availableRegions,
  };
}

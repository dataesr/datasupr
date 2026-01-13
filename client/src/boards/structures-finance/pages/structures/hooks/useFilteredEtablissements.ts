import { useMemo } from "react";

export function useFilteredEtablissements(
  allEtablissements: any[],
  selectedType: string,
  selectedRegion: string,
  selectedTypologie: string
) {
  return useMemo(() => {
    let filtered = allEtablissements;

    if (selectedType && selectedType !== "tous") {
      filtered = filtered.filter(
        (etab: any) =>
          etab.etablissement_actuel_type?.toLowerCase().trim() ===
          selectedType.toLowerCase().trim()
      );
    }

    if (selectedRegion && selectedRegion !== "toutes") {
      filtered = filtered.filter(
        (etab: any) =>
          etab.etablissement_actuel_region?.toLowerCase().trim() ===
          selectedRegion.toLowerCase().trim()
      );
    }

    if (selectedTypologie && selectedTypologie !== "toutes") {
      filtered = filtered.filter(
        (etab: any) =>
          etab.etablissement_actuel_typologie?.toLowerCase().trim() ===
          selectedTypologie.toLowerCase().trim()
      );
    }

    return filtered;
  }, [allEtablissements, selectedType, selectedRegion, selectedTypologie]);
}

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
          (etab.etablissement_actuel_type || etab.type)
            ?.toLowerCase()
            .trim() === selectedType.toLowerCase().trim()
      );
    }

    if (selectedRegion && selectedRegion !== "toutes") {
      filtered = filtered.filter(
        (etab: any) =>
          (etab.etablissement_actuel_region || etab.region)
            ?.toLowerCase()
            .trim() === selectedRegion.toLowerCase().trim()
      );
    }

    if (selectedTypologie && selectedTypologie !== "toutes") {
      filtered = filtered.filter(
        (etab: any) =>
          (etab.etablissement_actuel_typologie || etab.typologie)
            ?.toLowerCase()
            .trim() === selectedTypologie.toLowerCase().trim()
      );
    }

    return filtered;
  }, [allEtablissements, selectedType, selectedRegion, selectedTypologie]);
}

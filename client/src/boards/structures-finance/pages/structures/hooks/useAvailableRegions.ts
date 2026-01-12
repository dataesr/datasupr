import { useMemo } from "react";

/**
 * Hook pour calculer les régions disponibles en fonction des filtres
 */
export function useAvailableRegions(
  allEtablissements: any[],
  selectedType: string,
  selectedTypologie: string
) {
  return useMemo(() => {
    let etabsToConsider = allEtablissements;

    if (selectedType && selectedType !== "tous") {
      etabsToConsider = etabsToConsider.filter(
        (etab: any) =>
          (etab.etablissement_actuel_type || etab.type)
            ?.toLowerCase()
            .trim() === selectedType.toLowerCase().trim()
      );
    }
    if (selectedTypologie && selectedTypologie !== "toutes") {
      etabsToConsider = etabsToConsider.filter(
        (etab: any) =>
          (etab.etablissement_actuel_typologie || etab.typologie)
            ?.toLowerCase()
            .trim() === selectedTypologie.toLowerCase().trim()
      );
    }

    const regions = new Set<string>();
    etabsToConsider.forEach((etab: any) => {
      const region = etab.etablissement_actuel_region || etab.region;
      if (region && region.trim()) {
        regions.add(region.trim());
      }
    });

    return Array.from(regions).sort((a, b) => {
      return a.localeCompare(b, "fr", { sensitivity: "base" });
    });
  }, [allEtablissements, selectedType, selectedTypologie]);
}

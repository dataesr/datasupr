import { useMemo } from "react";

export function useAvailableTypologies(
  allEtablissements: any[],
  selectedType: string,
  selectedRegion: string
) {
  return useMemo(() => {
    let etabsToConsider = allEtablissements;

    if (selectedType && selectedType !== "tous") {
      etabsToConsider = etabsToConsider.filter(
        (etab: any) =>
          etab.etablissement_actuel_type?.toLowerCase().trim() ===
          selectedType.toLowerCase().trim()
      );
    }
    if (selectedRegion && selectedRegion !== "toutes") {
      etabsToConsider = etabsToConsider.filter(
        (etab: any) =>
          etab.etablissement_actuel_region?.toLowerCase().trim() ===
          selectedRegion.toLowerCase().trim()
      );
    }

    const typologies = new Set<string>();
    etabsToConsider.forEach((etab: any) => {
      const typologie = etab.etablissement_actuel_typologie;
      if (typologie && typologie.trim()) {
        typologies.add(typologie.trim());
      }
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
  }, [allEtablissements, selectedType, selectedRegion]);
}

import { useMemo } from "react";

export function useAvailableTypes(allEtablissements: any[]) {
  return useMemo(() => {
    const types = new Set<string>();
    allEtablissements.forEach((etab: any) => {
      const typeValue = etab.etablissement_actuel_type;
      if (typeValue && String(typeValue).trim()) {
        types.add(String(typeValue).trim());
      }
    });

    const sortedTypes = Array.from(types).sort((a, b) => {
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

    return sortedTypes;
  }, [allEtablissements]);
}

/**
 * Hook pour obtenir le type par défaut (priorité aux universités)
 */
export function useDefaultType(availableTypes: string[]) {
  return useMemo(() => {
    if (availableTypes.length === 0) return null;

    const universiteType = availableTypes.find(
      (t) =>
        t.toLowerCase().includes("université") ||
        t.toLowerCase().includes("universite")
    );

    return universiteType || availableTypes[0];
  }, [availableTypes]);
}

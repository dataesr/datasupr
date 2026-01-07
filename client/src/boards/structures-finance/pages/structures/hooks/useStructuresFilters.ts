import { useMemo } from "react";
import { useFinanceEtablissements } from "../../../api";

interface UseStructuresFiltersParams {
  selectedYear: string | number;
  selectedType?: string;
  selectedRegion?: string;
  selectedTypologie?: string;
}

interface UseStructuresFiltersReturn {
  allEtablissements: any[];
  availableTypes: string[];
  availableRegions: string[];
  availableTypologies: string[];
  filteredEtablissements: any[];
  defaultType: string | null;
  isLoading: boolean;
}

export function useStructuresFilters({
  selectedYear,
  selectedType,
  selectedRegion,
  selectedTypologie,
}: UseStructuresFiltersParams): UseStructuresFiltersReturn {
  const { data: etablissementsData, isLoading } = useFinanceEtablissements(
    String(selectedYear),
    !!selectedYear
  );

  const allEtablissements = useMemo(() => {
    if (!etablissementsData) return [];
    let etabs = Array.isArray(etablissementsData)
      ? etablissementsData
      : etablissementsData.data || etablissementsData.etablissements || [];

    const totalBefore = etabs.length;

    const etabsMap = new Map();
    etabs.forEach((etab: any) => {
      // Utiliser l'ID actuel, ou l'ID normal si pas d'ID actuel
      const currentId =
        etab.etablissement_id_paysage_actuel ||
        etab.etablissement_id_paysage ||
        etab.id;
      if (!currentId) return;

      // Privilégier l'entrée où etablissement_id_paysage === etablissement_id_paysage_actuel
      const existing = etabsMap.get(currentId);
      if (
        !existing ||
        etab.etablissement_id_paysage === etab.etablissement_id_paysage_actuel
      ) {
        etabsMap.set(currentId, etab);
      }
    });

    etabs = Array.from(etabsMap.values());

    console.log(
      `Établissements dédupliqués: ${totalBefore} -> ${etabs.length} (par établissement actuel)`,
      `Exemple:`,
      etabs[0]
    );

    return etabs;
  }, [etablissementsData]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    allEtablissements.forEach((etab: any) => {
      const typeValue =
        etab.etablissement_actuel_type ||
        etab.type ||
        etab.typologie ||
        etab.type_etablissement ||
        etab.typeEtablissement;
      if (typeValue && String(typeValue).trim()) {
        types.add(String(typeValue).trim());
      }
    });
    const sortedTypes = Array.from(types).sort();
    console.log(
      "Available types extracted:",
      sortedTypes,
      "from",
      allEtablissements.length,
      "etablissements"
    );
    return sortedTypes;
  }, [allEtablissements]);

  const availableRegions = useMemo(() => {
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

  const availableTypologies = useMemo(() => {
    let etabsToConsider = allEtablissements;

    if (selectedType && selectedType !== "tous") {
      etabsToConsider = etabsToConsider.filter(
        (etab: any) =>
          (etab.etablissement_actuel_type || etab.type)
            ?.toLowerCase()
            .trim() === selectedType.toLowerCase().trim()
      );
    }
    if (selectedRegion && selectedRegion !== "toutes") {
      etabsToConsider = etabsToConsider.filter(
        (etab: any) =>
          (etab.etablissement_actuel_region || etab.region)
            ?.toLowerCase()
            .trim() === selectedRegion.toLowerCase().trim()
      );
    }

    const typologies = new Set<string>();
    etabsToConsider.forEach((etab: any) => {
      const typologie = etab.etablissement_actuel_typologie || etab.typologie;
      if (typologie && typologie.trim()) {
        typologies.add(typologie.trim());
      }
    });

    return Array.from(typologies).sort((a, b) => {
      return a.localeCompare(b, "fr", { sensitivity: "base" });
    });
  }, [allEtablissements, selectedType, selectedRegion]);

  const defaultType = useMemo(() => {
    if (availableTypes.length === 0) return null;
    const universiteType = availableTypes.find(
      (t) =>
        t.toLowerCase().includes("université") ||
        t.toLowerCase().includes("universite")
    );
    return universiteType || availableTypes[0];
  }, [availableTypes]);

  const filteredEtablissements = useMemo(() => {
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

  return {
    allEtablissements,
    availableTypes,
    availableRegions,
    availableTypologies,
    filteredEtablissements,
    defaultType,
    isLoading,
  };
}

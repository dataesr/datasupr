import { useMemo } from "react";
import { useFinanceAdvancedComparison } from "../../api/api";

export function useEtablissementsData(selectedYear: string | number) {
  const { data: comparisonData, isLoading } = useFinanceAdvancedComparison(
    {
      annee: String(selectedYear),
      type: "",
      typologie: "",
      region: "",
    },
    !!selectedYear
  );

  const allEtablissements = useMemo(() => {
    if (!comparisonData || !comparisonData.items) return [];

    let etabs = comparisonData.items;

    const etabsMap = new Map();
    etabs.forEach((etab: any) => {
      const currentId =
        etab.etablissement_id_paysage_actuel ||
        etab.etablissement_id_paysage ||
        etab.id;
      if (!currentId) return;

      const existing = etabsMap.get(currentId);
      if (
        !existing ||
        etab.etablissement_id_paysage === etab.etablissement_id_paysage_actuel
      ) {
        etabsMap.set(currentId, etab);
      }
    });

    etabs = Array.from(etabsMap.values());

    return etabs;
  }, [comparisonData]);

  return {
    allEtablissements,
    isLoading,
  };
}

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
  selectedType = "tous",
  selectedRegion = "toutes",
  selectedTypologie = "toutes",
}: UseStructuresFiltersParams): UseStructuresFiltersReturn {
  const { allEtablissements, isLoading } = useEtablissementsData(selectedYear);

  const availableTypes = useAvailableTypes(allEtablissements);
  const defaultType = useDefaultType(availableTypes);

  const availableRegions = useAvailableRegions(
    allEtablissements,
    selectedType,
    selectedTypologie
  );

  const availableTypologies = useAvailableTypologies(
    allEtablissements,
    selectedType,
    selectedRegion
  );

  const filteredEtablissements = useFilteredEtablissements(
    allEtablissements,
    selectedType,
    selectedRegion,
    selectedTypologie
  );

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

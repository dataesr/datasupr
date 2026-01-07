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
    if (Array.isArray(etablissementsData)) return etablissementsData;
    return etablissementsData.data || etablissementsData.etablissements || [];
  }, [etablissementsData]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    allEtablissements.forEach((etab: any) => {
      const typeValue =
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
          etab.type?.toLowerCase().trim() === selectedType.toLowerCase().trim()
      );
    }
    if (selectedTypologie && selectedTypologie !== "toutes") {
      etabsToConsider = etabsToConsider.filter(
        (etab: any) =>
          etab.typologie?.toLowerCase().trim() ===
          selectedTypologie.toLowerCase().trim()
      );
    }

    const regions = new Set<string>();
    etabsToConsider.forEach((etab: any) => {
      if (etab.region && etab.region.trim()) {
        regions.add(etab.region.trim());
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
          etab.type?.toLowerCase().trim() === selectedType.toLowerCase().trim()
      );
    }
    if (selectedRegion && selectedRegion !== "toutes") {
      etabsToConsider = etabsToConsider.filter(
        (etab: any) =>
          etab.region?.toLowerCase().trim() ===
          selectedRegion.toLowerCase().trim()
      );
    }

    const typologies = new Set<string>();
    etabsToConsider.forEach((etab: any) => {
      if (etab.typologie && etab.typologie.trim()) {
        typologies.add(etab.typologie.trim());
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
          etab.type?.toLowerCase().trim() === selectedType.toLowerCase().trim()
      );
    }

    if (selectedRegion && selectedRegion !== "toutes") {
      filtered = filtered.filter(
        (etab: any) =>
          etab.region?.toLowerCase().trim() ===
          selectedRegion.toLowerCase().trim()
      );
    }

    if (selectedTypologie && selectedTypologie !== "toutes") {
      filtered = filtered.filter(
        (etab: any) =>
          etab.typologie?.toLowerCase().trim() ===
          selectedTypologie.toLowerCase().trim()
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

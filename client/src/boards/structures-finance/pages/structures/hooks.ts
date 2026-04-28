import { useMemo } from "react";
import { useFinanceAdvancedComparison } from "../../api";
import { isRce } from "../../utils/predicates";

const match = (a?: string, b?: string) =>
  a?.toLowerCase().trim() === b?.toLowerCase().trim();

const isDevimmo = (etab: any) => etab.devimmo === true;

const frSort = (a: string, b: string) =>
  a.localeCompare(b, "fr", { sensitivity: "base" });

const univFirst = (a: string, b: string) => {
  const aU =
    a.toLowerCase().includes("université") ||
    a.toLowerCase().includes("universite");
  const bU =
    b.toLowerCase().includes("université") ||
    b.toLowerCase().includes("universite");
  if (aU && !bU) return -1;
  if (!aU && bU) return 1;
  return frSort(a, b);
};

function deduplicateEtablissements(items: any[]): any[] {
  const map = new Map();
  items.forEach((etab: any) => {
    const id =
      etab.etablissement_id_paysage_actuel ||
      etab.etablissement_id_paysage ||
      etab.id;
    if (!id) return;
    const existing = map.get(id);
    if (
      !existing ||
      etab.etablissement_id_paysage === etab.etablissement_id_paysage_actuel
    ) {
      map.set(id, etab);
    }
  });
  return Array.from(map.values());
}

function extractValues(etabs: any[], key: string): string[] {
  const set = new Set<string>();
  etabs.forEach((e: any) => {
    const v = e[key];
    if (v && String(v).trim()) set.add(String(v).trim());
  });
  return Array.from(set);
}

function filterByTypeAndTypologie(
  etabs: any[],
  type: string,
  typologie: string
) {
  let result = etabs;
  if (type && type !== "tous") {
    result = result.filter((e: any) =>
      match(e.etablissement_actuel_type || e.type, type)
    );
  }
  if (typologie && typologie !== "toutes") {
    result = result.filter((e: any) =>
      match(e.etablissement_actuel_typologie || e.typologie, typologie)
    );
  }
  return result;
}

function filterByTypeAndRegion(etabs: any[], type: string, region: string) {
  let result = etabs;
  if (type && type !== "tous") {
    result = result.filter((e: any) =>
      match(e.etablissement_actuel_type, type)
    );
  }
  if (region && region !== "toutes") {
    result = result.filter((e: any) =>
      match(e.etablissement_actuel_region, region)
    );
  }
  return result;
}

interface UseStructuresFiltersParams {
  selectedYear: string | number;
  selectedType?: string;
  selectedRegion?: string;
  selectedTypologie?: string;
  selectedRce?: string;
  selectedDevimmo?: string;
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
  selectedRce = "tous",
  selectedDevimmo = "tous",
}: UseStructuresFiltersParams): UseStructuresFiltersReturn {
  const { data: comparisonData, isLoading } = useFinanceAdvancedComparison(
    { annee: String(selectedYear), type: "", typologie: "", region: "" },
    !!selectedYear
  );

  const allEtablissements = useMemo(
    () => deduplicateEtablissements(comparisonData?.items ?? []),
    [comparisonData]
  );

  const availableTypes = useMemo(
    () =>
      extractValues(allEtablissements, "etablissement_actuel_type").sort(
        univFirst
      ),
    [allEtablissements]
  );

  const defaultType = useMemo(() => {
    if (availableTypes.length === 0) return null;
    return (
      availableTypes.find(
        (t) =>
          t.toLowerCase().includes("université") ||
          t.toLowerCase().includes("universite")
      ) ?? availableTypes[0]
    );
  }, [availableTypes]);

  const availableRegions = useMemo(
    () =>
      extractValues(
        filterByTypeAndTypologie(
          allEtablissements,
          selectedType,
          selectedTypologie
        ),
        "etablissement_actuel_region"
      ).sort(frSort),
    [allEtablissements, selectedType, selectedTypologie]
  );

  const availableTypologies = useMemo(
    () =>
      extractValues(
        filterByTypeAndRegion(allEtablissements, selectedType, selectedRegion),
        "etablissement_actuel_typologie"
      ).sort(univFirst),
    [allEtablissements, selectedType, selectedRegion]
  );

  const filteredEtablissements = useMemo(() => {
    return allEtablissements
      .filter((etab: any) => {
        if (
          selectedType !== "tous" &&
          !match(etab.etablissement_actuel_type, selectedType)
        )
          return false;
        if (
          selectedRegion !== "toutes" &&
          !match(etab.etablissement_actuel_region, selectedRegion)
        )
          return false;
        if (
          selectedTypologie !== "toutes" &&
          !match(etab.etablissement_actuel_typologie, selectedTypologie)
        )
          return false;
        if (selectedRce === "rce" && !isRce(etab)) return false;
        if (selectedRce === "non-rce" && isRce(etab)) return false;
        if (selectedDevimmo === "devimmo" && !isDevimmo(etab)) return false;
        if (selectedDevimmo === "non-devimmo" && isDevimmo(etab)) return false;
        return true;
      })
      .sort((a: any, b: any) =>
        (a.etablissement_lib || "").localeCompare(
          b.etablissement_lib || "",
          "fr",
          { sensitivity: "base" }
        )
      );
  }, [
    allEtablissements,
    selectedType,
    selectedRegion,
    selectedTypologie,
    selectedRce,
    selectedDevimmo,
  ]);

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

export interface PositioningFilters {
  type?: string;
  typologie?: string;
  region?: string;
  rce?: string;
  devimmo?: string;
}

export function usePositioningData(
  selectedYear: string | number | undefined,
  currentStructure: any,
  filters: PositioningFilters
) {
  const { data: comparisonData, isLoading } = useFinanceAdvancedComparison(
    { annee: String(selectedYear), type: "", typologie: "", region: "" },
    !!selectedYear
  );

  const allItems = useMemo(
    () => deduplicateEtablissements(comparisonData?.items ?? []),
    [comparisonData]
  );

  const filteredItems = useMemo(() => {
    const structureId = currentStructure?.etablissement_id_paysage_actuel;

    return allItems.filter((item) => {
      const itemId = item.etablissement_id_paysage_actuel;

      if (structureId && itemId === structureId) return true;

      if (filters.type === "same-type") {
        const itemType = item.etablissement_actuel_type || item.type;
        const currentType =
          currentStructure?.etablissement_actuel_type || currentStructure?.type;
        if (itemType !== currentType) return false;
      }

      if (filters.typologie === "same-typologie") {
        const itemTypo = item.etablissement_actuel_typologie || item.typologie;
        const currentTypo =
          currentStructure?.etablissement_actuel_typologie ||
          currentStructure?.typologie;
        if (itemTypo !== currentTypo) return false;
      }

      if (filters.region === "same-region") {
        const itemRegion = item.etablissement_actuel_region || item.region;
        const currentRegion =
          currentStructure?.etablissement_actuel_region ||
          currentStructure?.region;
        if (itemRegion !== currentRegion) return false;
      }

      if (filters.rce === "rce" && item.is_rce !== true) return false;
      if (filters.rce === "non-rce" && item.is_rce === true) return false;

      if (filters.devimmo === "devimmo" && item.is_devimmo !== true)
        return false;
      if (filters.devimmo === "non-devimmo" && item.is_devimmo === true)
        return false;

      return true;
    });
  }, [allItems, currentStructure, filters]);

  return {
    allItems,
    filteredItems,
    isLoading,
  };
}

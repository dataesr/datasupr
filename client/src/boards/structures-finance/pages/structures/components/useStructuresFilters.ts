import { useMemo } from "react";
import { useFinanceAdvancedComparison } from "../../../api";
import { deduplicateEtablissements } from "../api";
import { isRce } from "../../../utils/predicates";
import {
  useAvailableOptions,
  sortUniversitiesFirst,
  sortLocale,
} from "../../../utils/useAvailableOptions";

const match = (a?: string, b?: string) =>
  a?.toLowerCase().trim() === b?.toLowerCase().trim();

const isDevimmo = (etab: any) => etab.devimmo === true;

interface UseStructuresFiltersParams {
  selectedYear: string | number;
  selectedType?: string;
  selectedRegion?: string;
  selectedTypologie?: string;
  selectedRce?: string;
  selectedDevimmo?: string;
}

export function useStructuresFilters({
  selectedYear,
  selectedType = "tous",
  selectedRegion = "toutes",
  selectedTypologie = "toutes",
  selectedRce = "tous",
  selectedDevimmo = "tous",
}: UseStructuresFiltersParams) {
  const { data: comparisonData, isLoading } = useFinanceAdvancedComparison(
    { annee: String(selectedYear), type: "", typologie: "", region: "" },
    !!selectedYear
  );

  const allEtablissements = useMemo(
    () => deduplicateEtablissements(comparisonData?.items ?? []),
    [comparisonData]
  );

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    allEtablissements.forEach((e: any) => {
      const v = e.etablissement_actuel_type;
      if (v && String(v).trim()) set.add(String(v).trim());
    });
    return Array.from(set).sort(sortUniversitiesFirst);
  }, [allEtablissements]);

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

  const matchField = (field: string) => (sel: string) => (e: any) =>
    match(e[field] || e[field.replace("etablissement_actuel_", "")], sel);

  const { typologies: availableTypologies, regions: availableRegions } =
    useAvailableOptions(allEtablissements, [
      {
        key: "type",
        field: "etablissement_actuel_type",
        selected: selectedType !== "tous" ? selectedType : "",
        predicate: matchField("etablissement_actuel_type"),
      },
      {
        key: "typologies",
        field: "etablissement_actuel_typologie",
        selected: selectedTypologie !== "toutes" ? selectedTypologie : "",
        predicate: matchField("etablissement_actuel_typologie"),
        sort: sortUniversitiesFirst,
      },
      {
        key: "regions",
        field: "etablissement_actuel_region",
        selected: selectedRegion !== "toutes" ? selectedRegion : "",
        predicate: matchField("etablissement_actuel_region"),
        sort: sortLocale,
      },
    ]);

  const filteredEtablissements = useMemo(
    () =>
      allEtablissements
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
          if (selectedDevimmo === "non-devimmo" && isDevimmo(etab))
            return false;
          return true;
        })
        .sort((a: any, b: any) =>
          (a.etablissement_lib || "").localeCompare(
            b.etablissement_lib || "",
            "fr",
            { sensitivity: "base" }
          )
        ),
    [
      allEtablissements,
      selectedType,
      selectedRegion,
      selectedTypologie,
      selectedRce,
      selectedDevimmo,
    ]
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

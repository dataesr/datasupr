import { useEtablissementsData } from "./useEtablissementsData";
import { useAvailableTypes, useDefaultType } from "./useAvailableTypes";
import { useAvailableRegions } from "./useAvailableRegions";
import { useAvailableTypologies } from "./useAvailableTypologies";
import { useFilteredEtablissements } from "./useFilteredEtablissements";

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

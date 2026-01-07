import { useState, useEffect, useMemo } from "react";
import { useFinanceYears, useFinanceEtablissementDetail } from "../../../api";
import { useStructuresFilters } from "./useStructuresFilters";
import { useStructuresUrlSync } from "./useStructuresUrlSync";

export function useStructuresState() {
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const {
    yearFromUrl,
    typeFromUrl,
    regionFromUrl,
    typologieFromUrl,
    etablissementFromUrl,
    updateUrl,
  } = useStructuresUrlSync();

  const [selectedYear, setSelectedYear] = useState<string | number>(
    () => yearFromUrl || years[0] || ""
  );
  const [activeTab, setActiveTab] = useState<
    | "financements"
    | "moyens-humains"
    | "etudiants"
    | "analyses"
    | "recettes-propres"
  >("financements");

  const {
    availableTypes,
    availableRegions,
    availableTypologies,
    filteredEtablissements,
    defaultType,
  } = useStructuresFilters({
    selectedYear,
    selectedType: typeFromUrl,
    selectedRegion: regionFromUrl,
    selectedTypologie: typologieFromUrl,
  });

  const selectedType = typeFromUrl || defaultType || "tous";
  const selectedRegion = regionFromUrl || "toutes";
  const selectedTypologie = typologieFromUrl || "toutes";
  const selectedEtablissement = etablissementFromUrl || "";

  useEffect(() => {
    let needsUpdate = false;
    let newRegion = selectedRegion;
    let newTypologie = selectedTypologie;

    if (
      selectedRegion !== "toutes" &&
      !availableRegions.includes(selectedRegion)
    ) {
      newRegion = "toutes";
      needsUpdate = true;
    }

    if (
      selectedTypologie !== "toutes" &&
      !availableTypologies.includes(selectedTypologie)
    ) {
      newTypologie = "toutes";
      needsUpdate = true;
    }

    if (needsUpdate) {
      updateUrl({
        year: selectedYear,
        type: selectedType,
        region: newRegion,
        typologie: newTypologie,
        structureId: "",
      });
    }
  }, [
    availableRegions,
    availableTypologies,
    selectedRegion,
    selectedTypologie,
    selectedYear,
    selectedType,
    updateUrl,
  ]);

  const { data: detailData, isLoading } = useFinanceEtablissementDetail(
    selectedEtablissement,
    String(selectedYear),
    !!selectedEtablissement && !!selectedYear
  );

  if (years.length > 0 && !selectedYear) {
    const defaultYear = years[0];
    setSelectedYear(defaultYear);
    updateUrl({
      year: defaultYear,
      type: selectedType,
      region: selectedRegion,
      typologie: selectedTypologie,
      structureId: "",
    });
  }

  const etablissementOptions = useMemo(
    () =>
      filteredEtablissements.map((etab: any) => {
        const displayName =
          etab.etablissement_actuel_lib || etab.etablissement_lib || etab.nom;
        const searchText = [
          displayName,
          etab.etablissement_lib,
          etab.etablissement_actuel_lib,
          etab.nom,
          etab.champ_recherche,
          etab.etablissement_actuel_region || etab.region,
        ]
          .filter(Boolean)
          .join(" ");

        return {
          id:
            etab.etablissement_id_paysage ||
            etab.etablissement_id_paysage_actuel ||
            etab.id,
          label: `${displayName}${
            etab.etablissement_actuel_region || etab.region
              ? ` — ${etab.etablissement_actuel_region || etab.region}`
              : ""
          }`,
          searchableText: searchText,
          subtitle: etab.champ_recherche,
        };
      }),
    [filteredEtablissements]
  );

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    updateUrl({
      year,
      type: selectedType,
      region: selectedRegion,
      typologie: selectedTypologie,
      structureId: selectedEtablissement,
    });
  };

  const handleTypeChange = (type: string) => {
    updateUrl({
      year: selectedYear,
      type,
      region: "toutes",
      typologie: "toutes",
      structureId: "",
    });
  };

  const handleRegionChange = (region: string) => {
    updateUrl({
      year: selectedYear,
      type: selectedType,
      region,
      typologie: selectedTypologie,
      structureId: "",
    });
  };

  const handleTypologieChange = (typologie: string) => {
    updateUrl({
      year: selectedYear,
      type: selectedType,
      region: selectedRegion,
      typologie,
      structureId: "",
    });
  };

  const handleEtablissementChange = (structureId: string) => {
    updateUrl({
      year: selectedYear,
      type: selectedType,
      region: selectedRegion,
      typologie: selectedTypologie,
      structureId,
    });
  };

  return {
    years,
    detailData,
    isLoading,

    selectedYear,
    activeTab,
    setActiveTab,

    availableTypes,
    selectedType,
    availableRegions,
    selectedRegion,
    availableTypologies,
    selectedTypologie,
    etablissementOptions,
    selectedEtablissement,

    handleYearChange,
    handleTypeChange,
    handleRegionChange,
    handleTypologieChange,
    handleEtablissementChange,
  };
}

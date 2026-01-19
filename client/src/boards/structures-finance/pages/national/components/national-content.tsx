import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { useFinanceAdvancedComparison } from "../api";
import { useFilteredNationalData } from "../hooks/useFilteredNationalData";
import SectionNavigation from "../sections/section-navigation";
import {
  ProduitsEffectifsSection,
  ScspEncadrementSection,
  ScspRessourcesSection,
  ComparaisonSection,
} from "../sections/sections";

export default function NationalContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "";
  const selectedType = searchParams.get("type") || "";
  const selectedTypologie = searchParams.get("typologie") || "";
  const selectedRegion = searchParams.get("region") || "";
  const activeSection = searchParams.get("section") || "produits-vs-etudiants";

  useEffect(() => {
    if (!searchParams.get("section")) {
      const next = new URLSearchParams(searchParams);
      next.set("section", "produits-vs-etudiants");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data: comparisonData, isLoading: isLoadingComparison } =
    useFinanceAdvancedComparison(
      {
        annee: String(selectedYear),
        type: "",
        typologie: "",
        region: "",
      },
      !!selectedYear
    );

  const allItems = useMemo(() => {
    if (!comparisonData || !comparisonData.items) return [];
    return comparisonData.items;
  }, [comparisonData]);

  const filteredItems = useFilteredNationalData(
    allItems,
    selectedType,
    selectedTypologie,
    selectedRegion
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "produits-vs-etudiants":
        return (
          <ProduitsEffectifsSection
            data={filteredItems}
            selectedYear={selectedYear}
          />
        );
      case "scsp-vs-encadrement":
        return (
          <ScspEncadrementSection
            data={filteredItems}
            selectedYear={selectedYear}
          />
        );
      case "scsp-vs-ressources-propres":
        return (
          <ScspRessourcesSection
            data={filteredItems}
            selectedYear={selectedYear}
          />
        );
      case "comparison":
        return <ComparaisonSection data={filteredItems} />;
      default:
        return null;
    }
  };

  return (
    <>
      <SectionNavigation />

      {isLoadingComparison && (
        <div
          className="fr-alert fr-alert--info"
          role="status"
          aria-live="polite"
        >
          <p className="fr-alert__title">Chargement en cours</p>
          <p>Chargement des données d'analyse...</p>
        </div>
      )}

      {!isLoadingComparison && filteredItems.length === 0 && (
        <div className="fr-alert fr-alert--warning" role="alert">
          <p className="fr-alert__title">Aucun résultat</p>
          <p>
            Aucun établissement ne correspond aux filtres sélectionnés. Essayez
            de modifier vos critères de recherche.
          </p>
        </div>
      )}

      {!isLoadingComparison &&
        filteredItems.length > 0 &&
        renderSectionContent()}
    </>
  );
}

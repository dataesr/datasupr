import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useFinanceAdvancedComparison } from "../../../api";
import { useFilteredNationalData } from "../hooks/useFilteredNationalData";
import TabNavigation from "../tabs/tab-navigation";
import {
  ProduitsEffectifsTab,
  ScspEncadrementTab,
  ScspRessourcesTab,
  ComparaisonTab,
} from "../tabs/tabs";

export default function NationalContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "";
  const selectedType = searchParams.get("type") || "";
  const selectedTypologie = searchParams.get("typologie") || "";
  const selectedRegion = searchParams.get("region") || "";
  const activeTab = searchParams.get("tab") || "scatter1";

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

  const handleTabChange = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "scatter1":
        return (
          <ProduitsEffectifsTab
            data={filteredItems}
            selectedYear={selectedYear}
          />
        );
      case "scatter2":
        return (
          <ScspEncadrementTab
            data={filteredItems}
            selectedYear={selectedYear}
          />
        );
      case "scatter3":
        return (
          <ScspRessourcesTab data={filteredItems} selectedYear={selectedYear} />
        );
      case "comparison":
        return <ComparaisonTab data={filteredItems} />;
      default:
        return null;
    }
  };

  return (
    <>
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

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

      {!isLoadingComparison && filteredItems.length > 0 && renderTabContent()}
    </>
  );
}

import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { Container, Text, Title } from "@dataesr/dsfr-plus";
import { useFinanceAdvancedComparison } from "../../../api/api";
import { useFilteredNationalData } from "../hooks/useFilteredNationalData";
import SectionNavigation from "./section-navigation";
import DefaultSkeleton from "../../../../../components/charts-skeletons/default";
import {
  ProduitsEffectifsSection,
  ScspEncadrementSection,
  ScspRessourcesSection,
  AnalyseSection,
} from "../sections/sections";

export default function NationalContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "";
  const selectedType = searchParams.get("type") || "";
  const selectedTypologie = searchParams.get("typologie") || "";
  const selectedRegion = searchParams.get("region") || "";
  const selectedRce = searchParams.get("rce") || "";
  const selectedDevimmo = searchParams.get("devimmo") || "";
  const activeSection = searchParams.get("section") || "produits-vs-etudiants";

  useEffect(() => {
    if (!searchParams.get("section")) {
      searchParams.set("section", "produits-vs-etudiants");
      setSearchParams(searchParams, { replace: true });
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
    selectedRegion,
    selectedRce,
    selectedDevimmo
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
        return (
          <AnalyseSection
            data={filteredItems}
            selectedYear={selectedYear}
            selectedType={selectedType}
            selectedTypologie={selectedTypologie}
            selectedRegion={selectedRegion}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container className="fr-py-3w">
      <SectionNavigation />

      {isLoadingComparison && <DefaultSkeleton height="400px" />}

      {!isLoadingComparison && filteredItems.length === 0 && (
        <div className="fr-alert fr-alert--warning fr-mt-3w" role="alert">
          <Title as="h2" look="h6" className="fr-alert__title">
            Aucun résultat
          </Title>
          <Text>
            Aucun établissement ne correspond aux filtres sélectionnés. Essayez
            de modifier vos critères de recherche.
          </Text>
        </div>
      )}

      {!isLoadingComparison &&
        filteredItems.length > 0 &&
        renderSectionContent()}
    </Container>
  );
}

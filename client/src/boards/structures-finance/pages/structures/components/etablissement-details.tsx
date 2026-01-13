import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useFinanceEtablissementDetail, useFinanceYears } from "../../../api";
import StickyHeader from "./sticky-header";
import EtablissementInfo from "./etablissement-info";
import SectionNavigation from "./section-navigation";
import {
  FinancementsSection,
  MoyensHumainsSection,
  RessourcesPropresSection,
  EtudiantsSection,
  AnalysesSection,
} from "../sections/sections";

export default function EtablissementDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const structureId = searchParams.get("structureId") || "";
  const year = searchParams.get("year") || "";
  const section = searchParams.get("section") || "financements";

  const { data: yearsData } = useFinanceYears();
  const years = yearsData?.years || [];

  useEffect(() => {
    if (structureId && !searchParams.get("section")) {
      const next = new URLSearchParams(searchParams);
      next.set("section", "financements");
      setSearchParams(next, { replace: true });
    }
  }, [structureId, searchParams, setSearchParams]);

  const { data: detailData, isLoading } = useFinanceEtablissementDetail(
    structureId,
    String(year || years[0] || ""),
    !!structureId && !!(year || years[0])
  );

  const handleYearChange = (newYear: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("year", newYear);
    setSearchParams(next);
  };

  if (!structureId) {
    return (
      <div className="fr-alert fr-alert--info fr-mt-3w">
        <h3 className="fr-alert__title">Sélectionnez un établissement</h3>
        <p>
          Utilisez les filtres ci-dessus pour affiner votre recherche, puis
          sélectionnez un établissement dans la liste déroulante pour visualiser
          ses données financières.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fr-mt-3w">
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (!detailData) {
    return null;
  }

  const showMergedBadge =
    detailData.etablissement_id_paysage !==
      detailData.etablissement_id_paysage_actuel &&
    detailData.date_de_fermeture == null;

  const showYearSelector = section !== "analyses";
  const selectedYear = year || years[0] || "";

  const renderSectionContent = () => {
    switch (section) {
      case "financements":
        return (
          <FinancementsSection data={detailData} selectedYear={selectedYear} />
        );
      case "moyens-humains":
        return (
          <MoyensHumainsSection data={detailData} selectedYear={selectedYear} />
        );
      case "recettes-propres":
        return (
          <RessourcesPropresSection
            data={detailData}
            selectedEtablissement={structureId}
            selectedYear={selectedYear}
          />
        );
      case "etudiants":
        return (
          <EtudiantsSection
            data={detailData}
            selectedYear={selectedYear}
            selectedEtablissement={structureId}
          />
        );
      case "analyses":
        return (
          <AnalysesSection
            data={detailData}
            selectedEtablissement={structureId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <StickyHeader
        currentName={detailData.etablissement_actuel_lib}
        historicalName={detailData.etablissement_lib}
        showMergedBadge={showMergedBadge}
        showYearSelector={showYearSelector}
        years={years}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />

      <EtablissementInfo data={detailData} />

      <SectionNavigation />

      {renderSectionContent()}
    </>
  );
}

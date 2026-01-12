import { useSearchParams } from "react-router-dom";
import { useFinanceEtablissementDetail, useFinanceYears } from "../../../api";
import StickyHeader from "./sticky-header";
import EtablissementInfo from "./etablissement-info";
import TabNavigation from "../tabs/tab-navigation";
import {
  FinancementsTab,
  MoyensHumainsTab,
  RessourcesPropresTab,
  EtudiantsTab,
  AnalysesTab,
} from "../tabs/tabs";

export default function EtablissementDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const structureId = searchParams.get("structureId") || "";
  const year = searchParams.get("year") || "";
  const tab = searchParams.get("tab") || "financements";

  const { data: yearsData } = useFinanceYears();
  const years = yearsData?.years || [];

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

  const handleTabChange = (
    newTab:
      | "financements"
      | "moyens-humains"
      | "etudiants"
      | "analyses"
      | "recettes-propres"
  ) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", newTab);
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

  const showYearSelector = tab !== "analyses";
  const selectedYear = year || years[0] || "";

  const renderTabContent = () => {
    switch (tab) {
      case "financements":
        return (
          <FinancementsTab data={detailData} selectedYear={selectedYear} />
        );
      case "moyens-humains":
        return (
          <MoyensHumainsTab data={detailData} selectedYear={selectedYear} />
        );
      case "recettes-propres":
        return (
          <RessourcesPropresTab
            data={detailData}
            selectedEtablissement={structureId}
            selectedYear={selectedYear}
          />
        );
      case "etudiants":
        return (
          <EtudiantsTab
            data={detailData}
            selectedYear={selectedYear}
            selectedEtablissement={structureId}
          />
        );
      case "analyses":
        return (
          <AnalysesTab data={detailData} selectedEtablissement={structureId} />
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

      <TabNavigation activeTab={tab as any} onTabChange={handleTabChange} />

      {renderTabContent()}
    </>
  );
}

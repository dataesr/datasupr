import { Container, Badge } from "@dataesr/dsfr-plus";
import SectionHeader from "../../components/layouts/section-header";
import { TabButton } from "../../components/tab-button";
import {
  FinancementsTab,
  MoyensHumainsTab,
  RessourcesPropresTab,
  EtudiantsTab,
  AnalysesTab,
} from "./tabs/tabs";
import EtablissementSelector from "./components/etablissement-selector";
import EtablissementInfo from "./components/etablissement-info";
import { useStructuresState } from "./hooks/useStructuresState";

export default function StructuresView() {
  const {
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
  } = useStructuresState();

  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Établissement" />

      <EtablissementSelector
        availableTypes={availableTypes}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        availableRegions={availableRegions}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        availableTypologies={availableTypologies}
        selectedTypologie={selectedTypologie}
        onTypologieChange={handleTypologieChange}
        etablissementOptions={etablissementOptions}
        selectedEtablissement={selectedEtablissement}
        onEtablissementChange={handleEtablissementChange}
      />

      {isLoading && (
        <div className="fr-mt-3w">
          <p>Chargement des données...</p>
        </div>
      )}

      {detailData && !isLoading && (
        <>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              backgroundColor: "var(--background-contrast-info)",
              padding: "1rem 1.5rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h4
              className="fr-text--lg fr-mb-0"
              style={{ fontWeight: 700, flex: 1 }}
            >
              {detailData.etablissement_actuel_lib}
            </h4>
            {detailData.etablissement_id_paysage !==
              detailData.etablissement_id_paysage_actuel &&
              detailData.date_de_fermeture == null && (
                <Badge color="info">Fusionné</Badge>
              )}
            {activeTab !== "analyses" && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--text-default-grey)",
                    fontWeight: 500,
                  }}
                >
                  Année
                </span>
                <select
                  className="fr-select"
                  style={{ width: "auto", minWidth: "120px" }}
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <EtablissementInfo data={detailData} />

          <div className="fr-mb-3w">
            <div className="fr-tabs">
              <ul className="fr-tabs__list" role="tablist">
                <TabButton
                  id="tab-financements"
                  label="Financements"
                  isActive={activeTab === "financements"}
                  tabPanelId="tabpanel-financements"
                  onClick={() => setActiveTab("financements")}
                />
                <TabButton
                  id="tab-moyens-humains"
                  label="Moyens humains"
                  isActive={activeTab === "moyens-humains"}
                  tabPanelId="tabpanel-moyens-humains"
                  onClick={() => setActiveTab("moyens-humains")}
                />
                <TabButton
                  id="tab-recettes-propres"
                  label="Ressources propres"
                  isActive={activeTab === "recettes-propres"}
                  tabPanelId="tabpanel-recettes-propres"
                  onClick={() => setActiveTab("recettes-propres")}
                />
                <TabButton
                  id="tab-etudiants"
                  label="Étudiants inscrits"
                  isActive={activeTab === "etudiants"}
                  tabPanelId="tabpanel-etudiants"
                  onClick={() => setActiveTab("etudiants")}
                />
                <TabButton
                  id="tab-analyses"
                  label="Analyses et évolutions"
                  isActive={activeTab === "analyses"}
                  tabPanelId="tabpanel-analyses"
                  onClick={() => setActiveTab("analyses")}
                />
              </ul>
            </div>
          </div>

          {activeTab === "financements" && (
            <FinancementsTab data={detailData} />
          )}

          {activeTab === "moyens-humains" && (
            <MoyensHumainsTab data={detailData} />
          )}

          {activeTab === "recettes-propres" && (
            <RessourcesPropresTab
              data={detailData}
              selectedEtablissement={selectedEtablissement}
              selectedYear={selectedYear}
            />
          )}

          {activeTab === "etudiants" && (
            <EtudiantsTab data={detailData} selectedYear={selectedYear} />
          )}

          {activeTab === "analyses" && (
            <AnalysesTab
              data={detailData}
              selectedEtablissement={selectedEtablissement}
            />
          )}
        </>
      )}

      {!selectedEtablissement && !isLoading && (
        <div className="fr-alert fr-alert--info fr-mt-3w">
          <h3 className="fr-alert__title">Sélectionnez un établissement</h3>
          <p>
            Utilisez les filtres ci-dessus pour affiner votre recherche, puis
            sélectionnez un établissement dans la liste déroulante pour
            visualiser ses données financières.
          </p>
        </div>
      )}
    </Container>
  );
}

import { useMemo, useState } from "react";
import { Container, Row, Col, Badge } from "@dataesr/dsfr-plus";
import { useFinanceYears, useFinanceEtablissementDetail } from "../../api";
import SectionHeader from "../../components/layouts/section-header";
import MetricOverview from "./components/metric-overview";
import DetailedCharts from "./components/detailed-charts";
import EvolutionChart from "./charts/evolution";
import RecettesEvolutionChart from "./charts/recettes-evolution";
import EvolutionRessourcesPropresChart from "./charts/evolution-ressources-propres";
import SearchableSelect from "../../components/searchable-select";
import { useStructuresFilters } from "./hooks/useStructuresFilters";
import { useStructuresUrlSync } from "./hooks/useStructuresUrlSync";
import { CHART_COLORS, DSFR_COLORS } from "../../constants/colors";

export default function StructuresView() {
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const {
    yearFromUrl,
    typeFromUrl,
    regionFromUrl,
    etablissementFromUrl,
    updateUrl,
  } = useStructuresUrlSync();

  const [selectedYear, setSelectedYear] = useState<string | number>(
    () => yearFromUrl || years[0] || ""
  );
  const [activeTab, setActiveTab] = useState<
    "vue-ensemble" | "details" | "evolution"
  >("vue-ensemble");

  const {
    availableTypes,
    availableRegions,
    filteredEtablissements,
    defaultType,
  } = useStructuresFilters({
    selectedYear,
    selectedType: typeFromUrl,
    selectedRegion: regionFromUrl,
  });

  const selectedType = typeFromUrl || defaultType || "tous";
  const selectedRegion = regionFromUrl || "toutes";

  const selectedEtablissement = etablissementFromUrl || "";

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
      structureId: "",
    });
  }

  const isClosed = detailData?.date_de_fermeture != null;
  const isActuel =
    detailData?.etablissement_id_paysage ===
    detailData?.etablissement_id_paysage_actuel;

  const etablissementOptions = useMemo(
    () =>
      filteredEtablissements.map((etab: any) => ({
        id: etab.id,
        label: `${etab.nom}${etab.region ? ` — ${etab.region}` : ""}`,
      })),
    [filteredEtablissements]
  );

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    updateUrl({
      year,
      type: selectedType,
      region: selectedRegion,
      structureId: selectedEtablissement,
    });
  };

  const handleTypeChange = (type: string) => {
    // Quand le type change, on prend le premier établissement de la nouvelle liste
    updateUrl({
      year: selectedYear,
      type,
      region: selectedRegion,
      structureId: "",
    });
  };

  const handleRegionChange = (region: string) => {
    updateUrl({
      year: selectedYear,
      type: selectedType,
      region,
      structureId: "",
    });
  };

  const handleEtablissementChange = (structureId: string) => {
    updateUrl({
      year: selectedYear,
      type: selectedType,
      region: selectedRegion,
      structureId,
    });
  };

  const filters = (
    <>
      <div
        className="fr-p-3w fr-mb-3w"
        style={{
          backgroundColor: DSFR_COLORS.backgroundDefaultHover,
          borderRadius: "8px",
          border: `2px solid ${CHART_COLORS.primary}`,
        }}
      >
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
            color: CHART_COLORS.primary,
          }}
        >
          🎯 Sélectionner un établissement
        </h3>

        <Row gutters className="fr-mb-2w">
          <Col md="12">
            <SearchableSelect
              label="Établissement"
              options={etablissementOptions}
              value={selectedEtablissement}
              onChange={handleEtablissementChange}
              placeholder="Rechercher un établissement..."
            />
          </Col>
        </Row>

        <Row gutters>
          <Col md="5">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Type</strong>
              </label>
              <select
                className="fr-select"
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="tous">Tous les types</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col md="5">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Région</strong>
              </label>
              <select
                className="fr-select"
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
              >
                <option value="toutes">Toutes les régions</option>
                {availableRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col
            md="2"
            style={{
              display: "flex",
              alignItems: "flex-end",
              paddingBottom: "0.5rem",
            }}
          >
            <Badge
              color="info"
              style={{ fontSize: "12px", padding: "0.4rem 0.8rem" }}
            >
              {filteredEtablissements.length} établissement
              {filteredEtablissements.length > 1 ? "s" : ""}
            </Badge>
          </Col>
        </Row>
      </div>

      {activeTab !== "evolution" && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "var(--background-default-grey)",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: DSFR_COLORS.textDefault,
              fontWeight: 500,
            }}
          >
            Année d'exercice
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
    </>
  );

  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Etablissement" />

      {filters}

      {isLoading && (
        <div className="fr-mt-3w">
          <p>Chargement des données...</p>
        </div>
      )}

      {detailData && !isLoading && (
        <>
          <div
            className="fr-mb-3w fr-p-3w"
            style={{
              backgroundColor: isClosed
                ? "var(--background-contrast-error)"
                : "var(--background-contrast-info)",
              borderRadius: "8px",
              border: `2px solid ${
                isClosed
                  ? "var(--border-plain-error)"
                  : "var(--border-plain-info)"
              }`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h4
                className="fr-text--lg fr-mb-0"
                style={{ fontWeight: 700, flex: 1 }}
              >
                {detailData.etablissement_lib}
              </h4>
              {isClosed && <Badge color="error">Fermé</Badge>}
              {!isActuel && !isClosed && <Badge color="info">Fusionné</Badge>}
              {isActuel && !isClosed && <Badge color="success">Actif</Badge>}
            </div>
            <Row gutters>
              <Col md="6">
                <p className="fr-text--sm fr-mb-1v">
                  <strong style={{ color: "var(--text-default-grey)" }}>
                    Type :
                  </strong>{" "}
                  {detailData.type}
                </p>
                <p className="fr-text--sm fr-mb-1v">
                  <strong style={{ color: DSFR_COLORS.textDefault }}>
                    Typologie :
                  </strong>{" "}
                  {detailData.typologie}
                </p>
              </Col>
              <Col md="6">
                <p className="fr-text--sm fr-mb-1v">
                  <strong style={{ color: DSFR_COLORS.textDefault }}>
                    Région :
                  </strong>{" "}
                  {detailData.region}
                </p>
                <p className="fr-text--sm fr-mb-1v">
                  <strong style={{ color: DSFR_COLORS.textDefault }}>
                    Commune :
                  </strong>{" "}
                  {detailData.commune}
                </p>
              </Col>
            </Row>
            {detailData.date_de_creation && (
              <p className="fr-text--sm fr-mb-0 fr-mt-2v">
                <strong style={{ color: DSFR_COLORS.textDefault }}>
                  Création :
                </strong>{" "}
                {new Date(detailData.date_de_creation).toLocaleDateString(
                  "fr-FR"
                )}
                {detailData.date_de_fermeture && (
                  <>
                    {" | "}
                    <strong style={{ color: DSFR_COLORS.textDefault }}>
                      Fermeture :
                    </strong>{" "}
                    {new Date(detailData.date_de_fermeture).toLocaleDateString(
                      "fr-FR"
                    )}
                  </>
                )}
              </p>
            )}
            {!isActuel && (
              <div
                className="fr-mt-2w fr-p-2w"
                style={{
                  backgroundColor: "var(--background-contrast-warning)",
                  borderRadius: "4px",
                  border: "1px solid var(--border-plain-warning)",
                  fontStyle: "italic",
                }}
              >
                <span style={{ color: "var(--text-default-warning)" }}>
                  → Actuellement :{" "}
                  <strong>{detailData.etablissement_actuel_lib}</strong> (
                  {detailData.etablissement_actuel_type})
                </span>
              </div>
            )}
          </div>

          <div className="fr-mb-3w">
            <div className="fr-tabs">
              <ul className="fr-tabs__list" role="tablist">
                <li role="presentation">
                  <button
                    className={`fr-tabs__tab ${
                      activeTab === "vue-ensemble"
                        ? "fr-tabs__tab--selected"
                        : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "vue-ensemble"}
                    onClick={() => setActiveTab("vue-ensemble")}
                  >
                    📊 Vue d'ensemble
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`fr-tabs__tab ${
                      activeTab === "details" ? "fr-tabs__tab--selected" : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "details"}
                    onClick={() => setActiveTab("details")}
                  >
                    📈 Analyses détaillées
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`fr-tabs__tab ${
                      activeTab === "evolution" ? "fr-tabs__tab--selected" : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "evolution"}
                    onClick={() => setActiveTab("evolution")}
                  >
                    📉 Évolution temporelle
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {activeTab === "vue-ensemble" && (
            <div
              className="fr-p-3w"
              style={{
                backgroundColor: DSFR_COLORS.backgroundDefault,
                borderRadius: "8px",
                border: `1px solid ${DSFR_COLORS.borderDefault}`,
              }}
            >
              <MetricOverview data={detailData} />
            </div>
          )}

          {activeTab === "details" && (
            <div
              className="fr-p-3w"
              style={{
                backgroundColor: DSFR_COLORS.backgroundDefault,
                borderRadius: "8px",
                border: `1px solid ${DSFR_COLORS.borderDefault}`,
              }}
            >
              <DetailedCharts
                data={detailData}
                selectedYear={selectedYear}
                etablissementName={detailData.etablissement_lib}
              />
            </div>
          )}

          {activeTab === "evolution" && (
            <div
              className="fr-p-3w"
              style={{
                backgroundColor: DSFR_COLORS.backgroundDefault,
                borderRadius: "8px",
                border: `1px solid ${DSFR_COLORS.borderDefault}`,
              }}
            >
              <EvolutionChart
                etablissementId={selectedEtablissement}
                etablissementName={detailData.etablissement_lib}
              />

              <div className="fr-mt-5w">
                <RecettesEvolutionChart
                  etablissementId={selectedEtablissement}
                  etablissementName={detailData.etablissement_lib}
                />
              </div>

              <div className="fr-mt-5w">
                <EvolutionRessourcesPropresChart
                  etablissementId={selectedEtablissement}
                  etablissementName={detailData.etablissement_lib}
                />
              </div>
            </div>
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

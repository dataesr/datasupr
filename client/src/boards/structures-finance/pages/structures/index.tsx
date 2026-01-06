import { useMemo, useState } from "react";
import { Container, Row, Col, Badge } from "@dataesr/dsfr-plus";
import { useFinanceYears, useFinanceEtablissementDetail } from "../../api";
import SectionHeader from "../../components/layouts/section-header";
import MetricOverview from "./components/metric-overview";
import EvolutionChart from "./charts/evolution";
import RecettesEvolutionChart from "./charts/recettes-evolution";
import EffectifsChart from "./charts/effectifs";
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
    typologieFromUrl,
    etablissementFromUrl,
    updateUrl,
  } = useStructuresUrlSync();

  const [selectedYear, setSelectedYear] = useState<string | number>(
    () => yearFromUrl || years[0] || ""
  );
  const [activeTab, setActiveTab] = useState<
    "financements" | "moyens-humains" | "etudiants" | "analyses"
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

  const isClosed = detailData?.date_de_fermeture != null;
  const isActuel =
    detailData?.etablissement_id_paysage ===
    detailData?.etablissement_id_paysage_actuel;

  const etablissementOptions = useMemo(
    () =>
      filteredEtablissements.map((etab: any) => {
        const displayName = etab.etablissement_actuel_lib || etab.nom;
        const searchText = [
          displayName,
          etab.nom,
          etab.champ_recherche,
          etab.region,
        ]
          .filter(Boolean)
          .join(" ");

        return {
          id: etab.id,
          label: `${displayName}${etab.region ? ` — ${etab.region}` : ""}`,
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
      region: selectedRegion,
      typologie: selectedTypologie,
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
          Sélectionner un établissement
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
          <Col md="4">
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
          <Col md="4">
            <div className="fr-select-group">
              <label className="fr-label">
                <strong>Typologie</strong>
              </label>
              <select
                className="fr-select"
                value={selectedTypologie}
                onChange={(e) => handleTypologieChange(e.target.value)}
              >
                <option value="toutes">Toutes les typologies</option>
                {availableTypologies.map((typologie) => (
                  <option key={typologie} value={typologie}>
                    {typologie}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col md="4">
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
        </Row>
      </div>

      {activeTab !== "analyses" && (
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
    </>
  );

  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Établissement" />

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
              backgroundColor: "var(--background-contrast-info)",
              borderRadius: "8px",
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
              {!isActuel && !isClosed && <Badge color="info">Fusionné</Badge>}
            </div>

            <Row gutters className="fr-mb-2v">
              <Col md="4">
                <p className="fr-text--sm fr-mb-1v">
                  <strong style={{ color: DSFR_COLORS.textDefault }}>
                    Type :
                  </strong>{" "}
                  {detailData.type}
                </p>
              </Col>
              <Col md="4">
                <p className="fr-text--sm fr-mb-1v">
                  <strong style={{ color: DSFR_COLORS.textDefault }}>
                    Région :
                  </strong>{" "}
                  {detailData.region}
                </p>
              </Col>
              <Col md="4">
                <p className="fr-text--sm fr-mb-1v">
                  <strong style={{ color: DSFR_COLORS.textDefault }}>
                    Commune du siège :
                  </strong>{" "}
                  {detailData.commune}
                </p>
                <p className="fr-text--sm fr-mb-0 fr-mt-2v">
                  <strong style={{ color: DSFR_COLORS.textDefault }}>
                    RCE :
                  </strong>{" "}
                  {detailData.is_rce ? (
                    <>
                      Oui
                      {detailData.rce && (
                        <span style={{ fontStyle: "italic" }}>
                          {" "}
                          (depuis {detailData.rce})
                        </span>
                      )}
                    </>
                  ) : (
                    "Non"
                  )}
                </p>
              </Col>
            </Row>

            {detailData.effectif_sans_cpge && (
              <p className="fr-text--sm fr-mb-2v">
                <strong style={{ color: DSFR_COLORS.textDefault }}>
                  Nombre d'étudiants inscrits :
                </strong>{" "}
                {detailData.effectif_sans_cpge.toLocaleString("fr-FR")}
              </p>
            )}

            <div style={{ marginTop: "0.75rem" }}>
              <p
                className="fr-text--sm fr-mb-1v"
                style={{
                  fontWeight: 600,
                  color: DSFR_COLORS.textDefault,
                }}
              >
                Formations proposées :
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {detailData.has_effectif_l && (
                  <Badge
                    color="blue-cumulus"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    licence
                  </Badge>
                )}
                {detailData.has_effectif_m && (
                  <Badge
                    color="green-archipel"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    master
                  </Badge>
                )}
                {detailData.has_effectif_d && (
                  <Badge
                    color="pink-tuile"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    doctorat
                  </Badge>
                )}
                {detailData.has_effectif_iut && (
                  <Badge
                    color="blue-cumulus"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    iut
                  </Badge>
                )}
                {detailData.has_effectif_ing && (
                  <Badge
                    color="yellow-tournesol"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    ingénieur
                  </Badge>
                )}
                {detailData.has_effectif_dsa && (
                  <Badge
                    color="green-emeraude"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    droit sciences éco aes
                  </Badge>
                )}
                {detailData.has_effectif_llsh && (
                  <Badge
                    color="pink-tuile"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    lettres langues shs
                  </Badge>
                )}
                {detailData.has_effectif_theo && (
                  <Badge
                    color="purple-glycine"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    théologie
                  </Badge>
                )}
                {detailData.has_effectif_si && (
                  <Badge
                    color="orange-terre-battue"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    sciences et ingénierie
                  </Badge>
                )}
                {detailData.has_effectif_staps && (
                  <Badge
                    color="green-menthe"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    staps
                  </Badge>
                )}
                {detailData.has_effectif_sante && (
                  <Badge
                    color="brown-caramel"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    santé
                  </Badge>
                )}
                {detailData.has_effectif_veto && (
                  <Badge
                    color="green-archipel"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    vétérinaire
                  </Badge>
                )}
                {detailData.has_effectif_interd && (
                  <Badge
                    color="pink-macaron"
                    style={{ 
                      fontSize: "11px", 
                      textTransform: "none",
                      backgroundColor: "white",
                      border: "2px solid"
                    }}
                  >
                    interdisciplinaire
                  </Badge>
                )}
              </div>
            </div>

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
                      activeTab === "financements"
                        ? "fr-tabs__tab--selected"
                        : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "financements"}
                    onClick={() => setActiveTab("financements")}
                  >
                    Financements
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`fr-tabs__tab ${
                      activeTab === "moyens-humains"
                        ? "fr-tabs__tab--selected"
                        : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "moyens-humains"}
                    onClick={() => setActiveTab("moyens-humains")}
                  >
                    Moyens humains
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`fr-tabs__tab ${
                      activeTab === "etudiants" ? "fr-tabs__tab--selected" : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "etudiants"}
                    onClick={() => setActiveTab("etudiants")}
                  >
                    Étudiants inscrits
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`fr-tabs__tab ${
                      activeTab === "analyses" ? "fr-tabs__tab--selected" : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "analyses"}
                    onClick={() => setActiveTab("analyses")}
                  >
                    Analyses et évolutions
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {activeTab === "financements" && (
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

          {activeTab === "moyens-humains" && (
            <div
              className="fr-p-3w"
              style={{
                backgroundColor: DSFR_COLORS.backgroundDefault,
                borderRadius: "8px",
                border: `1px solid ${DSFR_COLORS.borderDefault}`,
              }}
            >
              <div className="fr-mb-5w">
                <h3
                  className="fr-h5 fr-mb-3w"
                  style={{
                    borderLeft: `4px solid ${CHART_COLORS.tertiary}`,
                    paddingLeft: "1rem",
                  }}
                >
                  Les enseignants permanents
                </h3>
                <Row gutters>
                  <Col md="6">
                    <div
                      className="fr-card fr-enlarge-link"
                      style={{
                        height: "100%",
                        borderTop: `4px solid ${CHART_COLORS.palette[0]}`,
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "none",
                        backgroundColor: DSFR_COLORS.backgroundAlt,
                      }}
                    >
                      <div className="fr-card__body fr-p-2w">
                        <div className="fr-card__content">
                          <p
                            className="fr-text--sm fr-text--bold fr-mb-1v"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Nombre d'emplois (ETPT)
                          </p>
                          <p
                            className="fr-h4 fr-mb-1v"
                            style={{ fontWeight: 700, color: "#000" }}
                          >
                            {detailData.emploi_etpt != null
                              ? detailData.emploi_etpt.toLocaleString("fr-FR", {
                                  maximumFractionDigits: 1,
                                })
                              : "—"}
                          </p>
                          <p
                            className="fr-text--sm"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              margin: 0,
                            }}
                          >
                            Équivalent temps plein travaillé
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div
                      className="fr-card fr-enlarge-link"
                      style={{
                        height: "100%",
                        borderTop: `4px solid ${CHART_COLORS.palette[1]}`,
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "none",
                        backgroundColor: DSFR_COLORS.backgroundAlt,
                      }}
                    >
                      <div className="fr-card__body fr-p-2w">
                        <div className="fr-card__content">
                          <p
                            className="fr-text--sm fr-text--bold fr-mb-1v"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Taux d'encadrement
                          </p>
                          <p
                            className="fr-h4 fr-mb-1v"
                            style={{ fontWeight: 700, color: "#000" }}
                          >
                            {detailData.taux_encadrement != null
                              ? `${detailData.taux_encadrement.toFixed(1)} %`
                              : "—"}
                          </p>
                          <p
                            className="fr-text--sm"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              margin: 0,
                            }}
                          >
                            {detailData.effectif_sans_cpge
                              ? `Pour ${detailData.effectif_sans_cpge.toLocaleString(
                                  "fr-FR"
                                )} étudiants`
                              : "Enseignants permanents"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div>
                <h3
                  className="fr-h5 fr-mb-3w"
                  style={{
                    borderLeft: `4px solid ${CHART_COLORS.secondary}`,
                    paddingLeft: "1rem",
                  }}
                >
                  La masse salariale
                </h3>
                <Row gutters>
                  <Col md="4">
                    <div
                      className="fr-card fr-enlarge-link"
                      style={{
                        height: "100%",
                        borderTop: `4px solid ${CHART_COLORS.palette[2]}`,
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "none",
                        backgroundColor: DSFR_COLORS.backgroundAlt,
                      }}
                    >
                      <div className="fr-card__body fr-p-2w">
                        <div className="fr-card__content">
                          <p
                            className="fr-text--sm fr-text--bold fr-mb-1v"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Charges de personnel
                          </p>
                          <p
                            className="fr-h4 fr-mb-1v"
                            style={{ fontWeight: 700, color: "#000" }}
                          >
                            {detailData.charges_de_personnel != null
                              ? `${detailData.charges_de_personnel.toLocaleString(
                                  "fr-FR",
                                  { maximumFractionDigits: 0 }
                                )} €`
                              : "—"}
                          </p>
                          <p
                            className="fr-text--sm"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              margin: 0,
                            }}
                          >
                            Dépenses de masse salariale
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md="4">
                    <div
                      className="fr-card fr-enlarge-link"
                      style={{
                        height: "100%",
                        borderTop: `4px solid ${CHART_COLORS.palette[3]}`,
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "none",
                        backgroundColor: DSFR_COLORS.backgroundAlt,
                      }}
                    >
                      <div className="fr-card__body fr-p-2w">
                        <div className="fr-card__content">
                          <p
                            className="fr-text--sm fr-text--bold fr-mb-1v"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Poids sur produits
                          </p>
                          <p
                            className="fr-h4 fr-mb-1v"
                            style={{ fontWeight: 700, color: "#000" }}
                          >
                            {detailData.charges_de_personnel_produits_encaissables !=
                            null
                              ? `${detailData.charges_de_personnel_produits_encaissables.toFixed(
                                  1
                                )} %`
                              : "—"}
                          </p>
                          <p
                            className="fr-text--sm"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              margin: 0,
                            }}
                          >
                            Part des produits encaissables
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md="4">
                    <div
                      className="fr-card fr-enlarge-link"
                      style={{
                        height: "100%",
                        borderTop: `4px solid ${CHART_COLORS.palette[4]}`,
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "none",
                        backgroundColor: DSFR_COLORS.backgroundAlt,
                      }}
                    >
                      <div className="fr-card__body fr-p-2w">
                        <div className="fr-card__content">
                          <p
                            className="fr-text--sm fr-text--bold fr-mb-1v"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Rémunération permanents
                          </p>
                          <p
                            className="fr-h4 fr-mb-1v"
                            style={{ fontWeight: 700, color: "#000" }}
                          >
                            {detailData.taux_de_remuneration_des_permanents !=
                            null
                              ? `${detailData.taux_de_remuneration_des_permanents.toFixed(
                                  1
                                )} %`
                              : "—"}
                          </p>
                          <p
                            className="fr-text--sm"
                            style={{
                              color: DSFR_COLORS.textDefault,
                              margin: 0,
                            }}
                          >
                            Part des dépenses de personnel
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          {activeTab === "etudiants" && (
            <div
              className="fr-p-3w"
              style={{
                backgroundColor: DSFR_COLORS.backgroundDefault,
                borderRadius: "8px",
                border: `1px solid ${DSFR_COLORS.borderDefault}`,
              }}
            >
              <EffectifsChart
                data={detailData}
                selectedYear={selectedYear}
                etablissementName={detailData.etablissement_lib}
              />
            </div>
          )}

          {activeTab === "analyses" && (
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

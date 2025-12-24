import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Badge } from "@dataesr/dsfr-plus";
import {
  useFinanceYears,
  useFinanceComparisonFilters,
  useFinanceAdvancedComparison,
} from "../../api";
import SectionHeader from "../../layout/section-header";
import EvolutionNationaleChart from "./charts/evolution";
import AutonomieChart from "./charts/autonomie";
import AdvancedScatterChart from "./charts-comparison/advanced-scatter";
import AnalysisConfig from "./components-comparison/analysis-config";
import EncadrementByLevelChart from "./charts-comparison/encadrement-by-level";
import { DSFR_COLORS, CHART_COLORS } from "../../constants/colors";

export default function NationalView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);
  const yearFromUrl = searchParams.get("year") || "";
  const activeTab = searchParams.get("tab") || "comparative";
  const [selectedYear, setSelectedYear] = useState<string | number>(
    yearFromUrl
  );

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTypologie, setSelectedTypologie] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const [xAxis, setXAxis] = useState<string>("taux_encadrement");
  const [yAxis, setYAxis] = useState<string>("scsp_par_etudiants");
  const [sizeMetric, setSizeMetric] = useState<string>("effectif_sans_cpge");
  const [colorMetric, setColorMetric] = useState<string>(
    "part_ressources_propres"
  );
  const [colorBy, setColorBy] = useState<
    "region" | "type" | "typologie" | "metric"
  >("metric");

  const { data: filtersData } = useFinanceComparisonFilters(
    String(selectedYear),
    !!selectedYear
  );

  const { data: comparisonData, isLoading: isLoadingComparison } =
    useFinanceAdvancedComparison(
      {
        annee: String(selectedYear),
        type: selectedType,
        typologie: selectedTypologie,
        region: selectedRegion,
      },
      !!selectedYear &&
        (activeTab === "comparative" || activeTab === "encadrement")
    );

  const allItems = useMemo(() => {
    if (!comparisonData || !comparisonData.items) return [];
    return comparisonData.items;
  }, [comparisonData]);

  useEffect(() => {
    if (!years.length) return;
    const yearsStr = years.map(String);

    if (yearFromUrl && yearsStr.includes(yearFromUrl)) {
      if (selectedYear !== yearFromUrl) {
        setSelectedYear(yearFromUrl);
      }
      return;
    }

    const fallback = yearsStr[0];
    if (selectedYear !== fallback) {
      setSelectedYear(fallback);
    }

    const next = new URLSearchParams(searchParams);
    next.set("year", fallback);
    setSearchParams(next);
  }, [years, yearFromUrl, selectedYear, searchParams, setSearchParams]);

  useEffect(() => {
    if (filtersData && !selectedType && filtersData.types?.length) {
      setSelectedType(filtersData.types[0]);
    }
  }, [filtersData, selectedType]);

  const yearFilter = (
    <div className="fr-input-group fr-mb-0" style={{ minWidth: "240px" }}>
      <label className="fr-label" htmlFor="annee-exercice">
        Année d'exercice
      </label>
      <select
        className="fr-select"
        id="annee-exercice"
        name="annee-exercice"
        value={selectedYear}
        onChange={(e) => {
          setSelectedYear(e.target.value);
          const next = new URLSearchParams(searchParams);
          next.set("year", e.target.value);
          setSearchParams(next);
        }}
        disabled={!years.length}
      >
        {!years.length && <option>Chargement...</option>}
        {years.map((year) => (
          <option key={year} value={String(year)}>
            {`Exercice ${year}`}
          </option>
        ))}
      </select>
    </div>
  );

  const handleTabChange = (newTab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", newTab);
    setSearchParams(next);
  };

  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Vue nationale" />

      <div className="fr-mb-3w">
        <div className="fr-tabs">
          <ul className="fr-tabs__list" role="tablist">
            <li role="presentation">
              <button
                className={`fr-tabs__tab ${
                  activeTab === "comparative" ? "fr-tabs__tab--selected" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "comparative"}
                onClick={() => handleTabChange("comparative")}
              >
                📊 Analyse comparative
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
                onClick={() => handleTabChange("evolution")}
              >
                📈 Évolution temporelle
              </button>
            </li>
            <li role="presentation">
              <button
                className={`fr-tabs__tab ${
                  activeTab === "autonomie" ? "fr-tabs__tab--selected" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "autonomie"}
                onClick={() => handleTabChange("autonomie")}
              >
                💡 Autonomie & Efficience
              </button>
            </li>

            <li role="presentation">
              <button
                className={`fr-tabs__tab ${
                  activeTab === "encadrement" ? "fr-tabs__tab--selected" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "encadrement"}
                onClick={() => handleTabChange("encadrement")}
              >
                👥 Taux d'encadrement
              </button>
            </li>
          </ul>
        </div>
      </div>

      {(activeTab === "comparative" || activeTab === "encadrement") && (
        <div
          className="fr-p-3w fr-mb-3w"
          style={{
            backgroundColor: DSFR_COLORS.backgroundDefaultHover,
            borderRadius: "8px",
            border: `1px solid ${DSFR_COLORS.borderDefault}`,
          }}
        >
          <Row gutters>
            <Col md="3">
              <div className="fr-select-group">
                <label className="fr-label">
                  <strong>Année d'exercice</strong>
                </label>
                <select
                  className="fr-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      Exercice {year}
                    </option>
                  ))}
                </select>
              </div>
            </Col>

            <Col md="3">
              <div className="fr-select-group">
                <label className="fr-label">
                  <strong>Type d'établissement</strong>
                </label>
                <select
                  className="fr-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Tous les types</option>
                  {(filtersData?.types || []).map((type: string) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </Col>

            <Col md="3">
              <div className="fr-select-group">
                <label className="fr-label">
                  <strong>Typologie</strong>
                </label>
                <select
                  className="fr-select"
                  value={selectedTypologie}
                  onChange={(e) => setSelectedTypologie(e.target.value)}
                >
                  <option value="">Toutes les typologies</option>
                  {(filtersData?.typologies || []).map((typo: string) => (
                    <option key={typo} value={typo}>
                      {typo}
                    </option>
                  ))}
                </select>
              </div>
            </Col>

            <Col md="3">
              <div className="fr-select-group">
                <label className="fr-label">
                  <strong>Région</strong>
                </label>
                <select
                  className="fr-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="">Toutes les régions</option>
                  {(filtersData?.regions || []).map((region: string) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>

          {allItems.length > 0 && (
            <Row className="fr-mt-2w">
              <Col>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <Badge
                    color="info"
                    style={{ fontSize: "14px", padding: "0.5rem 1rem" }}
                  >
                    {allItems.length} établissement
                    {allItems.length > 1 ? "s" : ""} sélectionné
                    {allItems.length > 1 ? "s" : ""}
                  </Badge>
                </div>
              </Col>
            </Row>
          )}
        </div>
      )}

      {isLoadingComparison &&
        (activeTab === "comparative" || activeTab === "encadrement") && (
          <div className="fr-alert fr-alert--info">
            <p>Chargement des données...</p>
          </div>
        )}

      {!isLoadingComparison &&
        allItems.length === 0 &&
        (activeTab === "comparative" || activeTab === "encadrement") && (
          <div className="fr-alert fr-alert--warning">
            <p>
              Aucun établissement ne correspond aux filtres sélectionnés.
              Essayez de modifier vos critères.
            </p>
          </div>
        )}

      {activeTab === "vue-ensemble" && (
        <>
          <div
            className="fr-mb-3w fr-p-3w"
            style={{
              backgroundColor: DSFR_COLORS.backgroundDefaultHover,
              borderRadius: "8px",
              border: `1px solid ${DSFR_COLORS.borderDefault}`,
            }}
          >
            <Row>
              <div style={{ flex: 1 }}>
                <h3
                  className="fr-h6 fr-mb-0"
                  style={{
                    borderLeft: "4px solid #0078f3",
                    paddingLeft: "1rem",
                  }}
                >
                  Filtres de sélection
                </h3>
              </div>
              <div style={{ minWidth: "240px" }}>{yearFilter}</div>
            </Row>
          </div>
        </>
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
          <EvolutionNationaleChart selectedYear={String(selectedYear)} />
        </div>
      )}

      {activeTab === "autonomie" && (
        <div
          className="fr-p-3w"
          style={{
            backgroundColor: DSFR_COLORS.backgroundDefault,
            borderRadius: "8px",
            border: `1px solid ${DSFR_COLORS.borderDefault}`,
          }}
        >
          <AutonomieChart selectedYear={String(selectedYear)} />
        </div>
      )}

      {activeTab === "comparative" &&
        !isLoadingComparison &&
        allItems.length > 0 && (
          <>
            <Row className="fr-mb-3w">
              <Col>
                <div
                  className="fr-p-3w"
                  style={{
                    backgroundColor: DSFR_COLORS.backgroundDefault,
                    borderRadius: "8px",
                    border: `1px solid ${DSFR_COLORS.borderDefault}`,
                  }}
                >
                  <h3
                    className="fr-h6 fr-mb-3w"
                    style={{
                      borderLeft: `4px solid ${CHART_COLORS.secondary}`,
                      paddingLeft: "1rem",
                    }}
                  >
                    Configuration de l'analyse
                  </h3>
                  <AnalysisConfig
                    xAxis={xAxis}
                    yAxis={yAxis}
                    sizeMetric={sizeMetric}
                    colorMetric={colorMetric}
                    colorBy={colorBy}
                    data={allItems}
                    onXAxisChange={setXAxis}
                    onYAxisChange={setYAxis}
                    onSizeMetricChange={setSizeMetric}
                    onColorMetricChange={setColorMetric}
                    onColorByChange={setColorBy}
                  />
                </div>
              </Col>
            </Row>

            <Row gutters>
              <Col xs="12">
                <div
                  className="fr-p-3w"
                  style={{
                    backgroundColor: DSFR_COLORS.backgroundDefault,
                    borderRadius: "8px",
                    border: `1px solid ${DSFR_COLORS.borderDefault}`,
                  }}
                >
                  <AdvancedScatterChart
                    data={allItems}
                    xAxis={xAxis}
                    yAxis={yAxis}
                    sizeMetric={sizeMetric}
                    colorMetric={colorMetric}
                    colorBy={colorBy}
                  />
                </div>
              </Col>
            </Row>
          </>
        )}

      {activeTab === "encadrement" &&
        !isLoadingComparison &&
        allItems.length > 0 && (
          <Row gutters>
            <Col xs="12">
              <div
                className="fr-p-3w"
                style={{
                  backgroundColor: DSFR_COLORS.backgroundDefault,
                  borderRadius: "8px",
                  border: `1px solid ${DSFR_COLORS.borderDefault}`,
                }}
              >
                <EncadrementByLevelChart
                  data={allItems}
                  filters={{
                    annee: String(selectedYear),
                    type: selectedType,
                    typologie: selectedTypologie,
                    region: selectedRegion,
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
    </Container>
  );
}

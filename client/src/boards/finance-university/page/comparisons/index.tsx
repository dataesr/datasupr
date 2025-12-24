import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Badge } from "@dataesr/dsfr-plus";
import {
  useFinanceYears,
  useFinanceComparisonFilters,
  useFinanceAdvancedComparison,
} from "../../api";
import { DSFR_COLORS, CHART_COLORS } from "../../constants/colors";
import SectionHeader from "../../layout/section-header";
import AnalysisConfig from "../national/components-comparison/analysis-config";
import AdvancedScatterChart from "../national/charts-comparison/advanced-scatter";
import EncadrementByLevelChart from "../national/charts-comparison/encadrement-by-level";

export default function ComparisonsView() {
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);

  const [selectedYear, setSelectedYear] = useState<string | number>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTypologie, setSelectedTypologie] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"scatter" | "encadrement">(
    "scatter"
  );

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

  const { data: comparisonData, isLoading } = useFinanceAdvancedComparison(
    {
      annee: String(selectedYear),
      type: selectedType,
      typologie: selectedTypologie,
      region: selectedRegion,
    },
    !!selectedYear
  );

  useEffect(() => {
    if (years.length && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  useEffect(() => {
    if (filtersData && !selectedType && filtersData.types?.length) {
      setSelectedType(filtersData.types[0]);
    }
  }, [filtersData, selectedType]);

  const allItems = comparisonData?.items || [];

  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Comparaisons avancées" />

      {/* Section 1: Filtres */}
      <div
        className="fr-p-3w fr-mb-3w"
        style={{
          backgroundColor: DSFR_COLORS.backgroundDefaultHover,
          borderRadius: "8px",
          border: `1px solid ${DSFR_COLORS.borderDefault}`,
        }}
      >
        <h3
          className="fr-h6 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
          }}
        >
          Filtres de sélection
        </h3>
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

      {isLoading && (
        <div className="fr-alert fr-alert--info">
          <p>Chargement des données...</p>
        </div>
      )}

      {!isLoading && allItems.length === 0 && (
        <div className="fr-alert fr-alert--warning">
          <p>
            Aucun établissement ne correspond aux filtres sélectionnés. Essayez
            de modifier vos critères.
          </p>
        </div>
      )}

      {!isLoading && allItems.length > 0 && (
        <>
          {/* Section 2: Onglets de navigation */}
          <div className="fr-mb-3w">
            <div className="fr-tabs">
              <ul className="fr-tabs__list" role="tablist">
                <li role="presentation">
                  <button
                    className={`fr-tabs__tab ${
                      activeTab === "scatter" ? "fr-tabs__tab--selected" : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "scatter"}
                    onClick={() => setActiveTab("scatter")}
                  >
                    📊 Analyse comparative
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`fr-tabs__tab ${
                      activeTab === "encadrement"
                        ? "fr-tabs__tab--selected"
                        : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "encadrement"}
                    onClick={() => setActiveTab("encadrement")}
                  >
                    👥 Taux d'encadrement
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {activeTab === "scatter" && (
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

          {activeTab === "encadrement" && (
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
        </>
      )}
    </Container>
  );
}

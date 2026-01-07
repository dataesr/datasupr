import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Badge } from "@dataesr/dsfr-plus";
import { useFinanceYears, useFinanceAdvancedComparison } from "../../api";
import SectionHeader from "../../components/layouts/section-header";
import { TabButton } from "../../components/tab-button";
import { DSFR_COLORS } from "../../constants/colors";
import ScatterChart from "./charts/scatter";
import { ScatterConfig } from "./charts/scatter/options";
import ComparisonBarChart from "./charts/comparison-bar";

export default function NationalView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);
  const yearFromUrl = searchParams.get("year") || "";
  const [activeTab, setActiveTab] = useState<string>("scatter1");
  const [selectedYear, setSelectedYear] = useState<string | number>(
    yearFromUrl
  );

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTypologie, setSelectedTypologie] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

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

  const availableTypes = useMemo(() => {
    if (!allItems.length) return [];

    let itemsToConsider = allItems;

    if (selectedTypologie) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.etablissement_actuel_typologie === selectedTypologie
      );
    }
    if (selectedRegion) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.region === selectedRegion
      );
    }

    const types = new Set<string>();
    itemsToConsider.forEach((item: any) => {
      if (item.type) types.add(item.type);
    });
    return Array.from(types).sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" })
    );
  }, [allItems, selectedTypologie, selectedRegion]);

  const availableTypologies = useMemo(() => {
    if (!allItems.length) return [];

    let itemsToConsider = allItems;

    if (selectedType) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.type === selectedType
      );
    }
    if (selectedRegion) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.region === selectedRegion
      );
    }

    const typologies = new Set<string>();
    itemsToConsider.forEach((item: any) => {
      if (item.etablissement_actuel_typologie)
        typologies.add(item.etablissement_actuel_typologie);
    });
    return Array.from(typologies).sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" })
    );
  }, [allItems, selectedType, selectedRegion]);

  const availableRegions = useMemo(() => {
    if (!allItems.length) return [];

    let itemsToConsider = allItems;

    if (selectedType) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.type === selectedType
      );
    }
    if (selectedTypologie) {
      itemsToConsider = itemsToConsider.filter(
        (item: any) => item.etablissement_actuel_typologie === selectedTypologie
      );
    }

    const regions = new Set<string>();
    itemsToConsider.forEach((item: any) => {
      if (item.region) regions.add(item.region);
    });
    return Array.from(regions).sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" })
    );
  }, [allItems, selectedType, selectedTypologie]);

  const filteredItems = useMemo(() => {
    let items = allItems;

    if (selectedType) {
      items = items.filter((item: any) => item.type === selectedType);
    }
    if (selectedTypologie) {
      items = items.filter(
        (item: any) => item.etablissement_actuel_typologie === selectedTypologie
      );
    }
    if (selectedRegion) {
      items = items.filter((item: any) => item.region === selectedRegion);
    }

    return items;
  }, [allItems, selectedType, selectedTypologie, selectedRegion]);

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
    if (availableTypes.length && !selectedType) {
      const universiteType = availableTypes.find(
        (t) =>
          t.toLowerCase().includes("université") ||
          t.toLowerCase().includes("universite")
      );
      setSelectedType(universiteType || availableTypes[0]);
    }
  }, [availableTypes, selectedType]);

  useEffect(() => {
    if (selectedType && !availableTypes.includes(selectedType)) {
      setSelectedType("");
    }
    if (selectedTypologie && !availableTypologies.includes(selectedTypologie)) {
      setSelectedTypologie("");
    }
    if (selectedRegion && !availableRegions.includes(selectedRegion)) {
      setSelectedRegion("");
    }
  }, [
    availableTypes,
    availableTypologies,
    availableRegions,
    selectedType,
    selectedTypologie,
    selectedRegion,
  ]);

  const scatterConfigs: ScatterConfig[] = [
    {
      title: "Produits de fonctionnement vs Effectifs",
      xMetric: "produits_de_fonctionnement_encaissables",
      yMetric: "effectif_sans_cpge",
      xLabel: "Produits de fonctionnement encaissables (€)",
      yLabel: "Effectif étudiants (sans CPGE)",
    },
    {
      title: "SCSP par étudiant vs Taux d'encadrement",
      xMetric: "scsp_par_etudiants",
      yMetric: "taux_encadrement",
      xLabel: "SCSP par étudiant (€)",
      yLabel: "Taux d'encadrement (%)",
    },
    {
      title: "SCSP vs Ressources propres",
      xMetric: "scsp",
      yMetric: "ressources_propres",
      xLabel: "SCSP (€)",
      yLabel: "Ressources propres (€)",
    },
  ];

  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Vue nationale" />

      <p className="fr-text--lead fr-mb-3w">
        Visualisez et comparez les indicateurs financiers et d'effectifs des
        établissements d'enseignement supérieur au niveau national.
      </p>

      <div className="fr-mb-3w">
        <div className="fr-tabs">
          <ul
            className="fr-tabs__list"
            role="tablist"
            aria-label="Analyses disponibles"
          >
            <TabButton
              id="tab-scatter1"
              label="Produits vs Effectifs"
              isActive={activeTab === "scatter1"}
              tabPanelId="tabpanel-scatter1"
              onClick={() => setActiveTab("scatter1")}
            />
            <TabButton
              id="tab-scatter2"
              label="SCSP vs Encadrement"
              isActive={activeTab === "scatter2"}
              tabPanelId="tabpanel-scatter2"
              onClick={() => setActiveTab("scatter2")}
            />
            <TabButton
              id="tab-scatter3"
              label="SCSP vs Ressources propres"
              isActive={activeTab === "scatter3"}
              tabPanelId="tabpanel-scatter3"
              onClick={() => setActiveTab("scatter3")}
            />
            <TabButton
              id="tab-comparison"
              label="Comparaison de métriques"
              isActive={activeTab === "comparison"}
              tabPanelId="tabpanel-comparison"
              onClick={() => setActiveTab("comparison")}
            />
          </ul>
        </div>
      </div>

      <section
        className="fr-p-3w fr-mb-3w"
        style={{
          backgroundColor: DSFR_COLORS.backgroundDefaultHover,
          borderRadius: "8px",
          border: `1px solid ${DSFR_COLORS.borderDefault}`,
        }}
        aria-labelledby="filters-title"
      >
        <h2 id="filters-title" className="fr-h6 fr-mb-3w">
          Filtres de sélection
        </h2>
        <Row gutters>
          <Col xs="12" sm="6" md="3">
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="select-year">
                <strong>Année</strong>
                <span className="fr-hint-text">Année de référence</span>
              </label>
              <select
                id="select-year"
                className="fr-select"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  const next = new URLSearchParams(searchParams);
                  next.set("year", e.target.value);
                  setSearchParams(next);
                }}
                aria-required="true"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    Exercice {year}
                  </option>
                ))}
              </select>
            </div>
          </Col>

          <Col xs="12" sm="6" md="3">
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="select-type">
                <strong>Type d'établissement</strong>
                <span className="fr-hint-text">
                  Filtrer par type (optionnel)
                </span>
              </label>
              <select
                id="select-type"
                className="fr-select"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedTypologie("");
                  setSelectedRegion("");
                }}
              >
                <option value="">Tous les types</option>
                {availableTypes.map((type: string) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </Col>

          <Col xs="12" sm="6" md="3">
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="select-typologie">
                <strong>Typologie</strong>
                <span className="fr-hint-text">
                  Filtrer par typologie (optionnel)
                </span>
              </label>
              <select
                id="select-typologie"
                className="fr-select"
                value={selectedTypologie}
                onChange={(e) => setSelectedTypologie(e.target.value)}
              >
                <option value="">Toutes les typologies</option>
                {availableTypologies.map((typo: string) => (
                  <option key={typo} value={typo}>
                    {typo}
                  </option>
                ))}
              </select>
            </div>
          </Col>

          <Col xs="12" sm="6" md="3">
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="select-region">
                <strong>Région</strong>
                <span className="fr-hint-text">
                  Filtrer par région (optionnel)
                </span>
              </label>
              <select
                id="select-region"
                className="fr-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Toutes les régions</option>
                {availableRegions.map((region: string) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        </Row>

        {filteredItems.length > 0 && (
          <Row className="fr-mt-2w">
            <Col>
              <div role="status" aria-live="polite">
                <Badge
                  color="info"
                  style={{ fontSize: "14px", padding: "0.5rem 1rem" }}
                >
                  {filteredItems.length} établissement
                  {filteredItems.length > 1 ? "s" : ""} sélectionné
                  {filteredItems.length > 1 ? "s" : ""}
                </Badge>
              </div>
            </Col>
          </Row>
        )}
      </section>

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

      {!isLoadingComparison && filteredItems.length > 0 && (
        <>
          {activeTab === "scatter1" && (
            <section
              id="tabpanel-scatter1"
              role="tabpanel"
              aria-labelledby="tab-scatter1"
              tabIndex={0}
              className="fr-mb-3w"
            >
              <Row>
                <Col xs="12">
                  <div className="fr-sr-only">
                    Graphique de corrélation entre les produits de
                    fonctionnement encaissables et les effectifs étudiants pour{" "}
                    {filteredItems.length} établissement
                    {filteredItems.length > 1 ? "s" : ""}
                  </div>
                  <ScatterChart
                    config={scatterConfigs[0]}
                    data={filteredItems}
                  />
                </Col>
              </Row>
            </section>
          )}

          {activeTab === "scatter2" && (
            <section
              id="tabpanel-scatter2"
              role="tabpanel"
              aria-labelledby="tab-scatter2"
              tabIndex={0}
              className="fr-mb-3w"
            >
              <Row>
                <Col xs="12">
                  <div className="fr-sr-only">
                    Graphique de corrélation entre le SCSP par étudiant et le
                    taux d'encadrement pour {filteredItems.length} établissement
                    {filteredItems.length > 1 ? "s" : ""}
                  </div>
                  <ScatterChart
                    config={scatterConfigs[1]}
                    data={filteredItems}
                  />
                </Col>
              </Row>
            </section>
          )}

          {activeTab === "scatter3" && (
            <section
              id="tabpanel-scatter3"
              role="tabpanel"
              aria-labelledby="tab-scatter3"
              tabIndex={0}
              className="fr-mb-3w"
            >
              <Row>
                <Col xs="12">
                  <div className="fr-sr-only">
                    Graphique de corrélation entre le SCSP et les ressources
                    propres pour {filteredItems.length} établissement
                    {filteredItems.length > 1 ? "s" : ""}
                  </div>
                  <ScatterChart
                    config={scatterConfigs[2]}
                    data={filteredItems}
                  />
                </Col>
              </Row>
            </section>
          )}

          {activeTab === "comparison" && (
            <section
              id="tabpanel-comparison"
              role="tabpanel"
              aria-labelledby="tab-comparison"
              tabIndex={0}
              className="fr-mb-3w"
            >
              <Row>
                <Col xs="12">
                  <div className="fr-sr-only">
                    Graphique de comparaison de métriques entre établissements
                  </div>
                  <ComparisonBarChart data={filteredItems} />
                </Col>
              </Row>
            </section>
          )}
        </>
      )}
    </Container>
  );
}

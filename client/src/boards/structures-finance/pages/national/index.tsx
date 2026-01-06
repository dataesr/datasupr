import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Badge } from "@dataesr/dsfr-plus";
import {
  useFinanceYears,
  useFinanceComparisonFilters,
  useFinanceAdvancedComparison,
} from "../../api";
import SectionHeader from "../../components/layouts/section-header";
import { DSFR_COLORS, CHART_COLORS } from "../../constants/colors";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function NationalView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: yearsData } = useFinanceYears();
  const years = useMemo(() => yearsData?.years || [], [yearsData]);
  const yearFromUrl = searchParams.get("year") || "";
  const activeTab = searchParams.get("tab") || "scatter1";
  const [selectedYear, setSelectedYear] = useState<string | number>(
    yearFromUrl
  );

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTypologie, setSelectedTypologie] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

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
      !!selectedYear
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

  const handleTabChange = (newTab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", newTab);
    setSearchParams(next);
  };

  const scatterConfigs = [
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

  const createScatterOptions = (
    config: {
      title: string;
      xMetric: string;
      yMetric: string;
      xLabel: string;
      yLabel: string;
    },
    data: any[]
  ): Highcharts.Options => {
    // Grouper par région
    const regionGroups = new Map<string, any[]>();

    data
      .filter(
        (item) => item[config.xMetric] != null && item[config.yMetric] != null
      )
      .forEach((item) => {
        const region = item.region || "Non spécifié";
        if (!regionGroups.has(region)) {
          regionGroups.set(region, []);
        }

        const etablissementName =
          item.etablissement_lib ||
          item.etablissement_actuel_lib ||
          "Établissement inconnu";

        regionGroups.get(region)!.push({
          x: item[config.xMetric],
          y: item[config.yMetric],
          z: Math.sqrt(item[config.yMetric]) / 10, // Taille basée sur Y
          name: etablissementName,
          region: item.region,
          type: item.type,
        });
      });

    const colors = CHART_COLORS.palette;
    const series = Array.from(regionGroups.entries()).map(
      ([region, items], index) => ({
        name: region,
        type: "bubble" as const,
        data: items,
        color: colors[index % colors.length],
      })
    );

    return {
      chart: {
        type: "bubble",
        height: 600,
        backgroundColor: "transparent",
      },
      title: {
        text: config.title,
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
        },
      },
      xAxis: {
        title: {
          text: config.xLabel,
          style: {
            fontSize: "13px",
            fontWeight: "500",
          },
        },
        gridLineWidth: 1,
        gridLineColor: "#e5e5e5",
      },
      yAxis: {
        title: {
          text: config.yLabel,
          style: {
            fontSize: "13px",
            fontWeight: "500",
          },
        },
        gridLineColor: "#e5e5e5",
      },
      tooltip: {
        useHTML: true,
        backgroundColor: "var(--background-default-grey)",
        borderWidth: 1,
        borderColor: "var(--border-default-grey)",
        borderRadius: 8,
        shadow: false,
        formatter: function () {
          const point = this as any;
          return `
            <div style="padding:10px">
              <div style="font-weight:bold;margin-bottom:8px;font-size:14px">${
                point.name
              }</div>
              <div style="margin-bottom:4px;color:#666;font-size:12px">${
                point.type
              } • ${point.region}</div>
              <div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e5e5">
                <div style="margin-bottom:4px"><strong>${
                  config.xLabel
                }:</strong> ${Highcharts.numberFormat(
            point.x,
            0,
            ",",
            " "
          )}</div>
                <div><strong>${
                  config.yLabel
                }:</strong> ${Highcharts.numberFormat(
            point.y,
            2,
            ",",
            " "
          )}</div>
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        bubble: {
          minSize: 5,
          maxSize: 40,
        },
      },
      legend: {
        enabled: true,
        align: "right",
        verticalAlign: "middle",
        layout: "vertical",
        itemStyle: {
          fontSize: "11px",
        },
      },
      credits: {
        enabled: false,
      },
      series: series,
    };
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
                  activeTab === "scatter1" ? "fr-tabs__tab--selected" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "scatter1"}
                onClick={() => handleTabChange("scatter1")}
              >
                Produits vs Effectifs
              </button>
            </li>
            <li role="presentation">
              <button
                className={`fr-tabs__tab ${
                  activeTab === "scatter2" ? "fr-tabs__tab--selected" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "scatter2"}
                onClick={() => handleTabChange("scatter2")}
              >
                SCSP vs Encadrement
              </button>
            </li>
            <li role="presentation">
              <button
                className={`fr-tabs__tab ${
                  activeTab === "scatter3" ? "fr-tabs__tab--selected" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "scatter3"}
                onClick={() => handleTabChange("scatter3")}
              >
                SCSP vs Ressources propres
              </button>
            </li>
          </ul>
        </div>
      </div>

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
                <strong>Année</strong>
              </label>
              <select
                className="fr-select"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  const next = new URLSearchParams(searchParams);
                  next.set("year", e.target.value);
                  setSearchParams(next);
                }}
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
              <Badge
                color="info"
                style={{ fontSize: "14px", padding: "0.5rem 1rem" }}
              >
                {allItems.length} établissement
                {allItems.length > 1 ? "s" : ""} sélectionné
                {allItems.length > 1 ? "s" : ""}
              </Badge>
            </Col>
          </Row>
        )}
      </div>

      {isLoadingComparison && (
        <div className="fr-alert fr-alert--info">
          <p>Chargement des données...</p>
        </div>
      )}

      {!isLoadingComparison && allItems.length === 0 && (
        <div className="fr-alert fr-alert--warning">
          <p>
            Aucun établissement ne correspond aux filtres sélectionnés. Essayez
            de modifier vos critères.
          </p>
        </div>
      )}

      {!isLoadingComparison && allItems.length > 0 && (
        <>
          {activeTab === "scatter1" && (
            <Row className="fr-mb-3w">
              <Col xs="12">
                <div
                  className="fr-p-3w"
                  style={{
                    backgroundColor: DSFR_COLORS.backgroundDefault,
                    borderRadius: "8px",
                    border: `1px solid ${DSFR_COLORS.borderDefault}`,
                  }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={createScatterOptions(scatterConfigs[0], allItems)}
                  />
                </div>
              </Col>
            </Row>
          )}

          {activeTab === "scatter2" && (
            <Row className="fr-mb-3w">
              <Col xs="12">
                <div
                  className="fr-p-3w"
                  style={{
                    backgroundColor: DSFR_COLORS.backgroundDefault,
                    borderRadius: "8px",
                    border: `1px solid ${DSFR_COLORS.borderDefault}`,
                  }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={createScatterOptions(scatterConfigs[1], allItems)}
                  />
                </div>
              </Col>
            </Row>
          )}

          {activeTab === "scatter3" && (
            <Row className="fr-mb-3w">
              <Col xs="12">
                <div
                  className="fr-p-3w"
                  style={{
                    backgroundColor: DSFR_COLORS.backgroundDefault,
                    borderRadius: "8px",
                    border: `1px solid ${DSFR_COLORS.borderDefault}`,
                  }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={createScatterOptions(scatterConfigs[2], allItems)}
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

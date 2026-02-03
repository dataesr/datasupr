import { Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFinanceAdvancedComparison } from "../../../../api/api";
import PositioningFilters from "./components/positioning-filters";
import PositioningMetricFilter from "./components/positioning-metric-filter";
import PositioningScatterChart from "./charts/positioning-scatter";
import PositioningComparisonBarChart from "./charts/positioning-comparison-bar";
import {
  usePositioningFilteredData,
  type PositioningFilters as PositioningFiltersType,
} from "./hooks/usePositioningFilteredData";
import {
  type AnalysisKey,
  PREDEFINED_ANALYSES,
} from "../analyses/charts/evolution/config";
import { Select } from "../../../../components/select";
import "../styles.scss";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import MetricDefinitionsTable from "../../../../components/metric-definitions/metric-definitions-table";

interface PositionnementSectionProps {
  data: any;
  selectedYear?: string | number;
}

type ChartView = "comparison" | "scatter-1" | "scatter-2" | "scatter-3";

export function PositionnementSection({
  data,
  selectedYear,
}: PositionnementSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeChart =
    (searchParams.get("positioningChart") as ChartView) || "comparison";

  const [filters, setFilters] = useState<PositioningFiltersType>({
    type: searchParams.get("positioningType") || "",
    typologie: searchParams.get("positioningTypologie") || "",
    region: searchParams.get("positioningRegion") || "",
    rce: searchParams.get("positioningRce") || "",
    devimmo: searchParams.get("positioningDevimmo") || "",
  });

  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisKey | null>(
    "ressources-total"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "Indicateurs financiers"
  );

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters: PositioningFiltersType) => {
    setFilters(newFilters);
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      const paramKey = `positioning${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (value) {
        params.set(paramKey, value);
      } else {
        params.delete(paramKey);
      }
    });
    setSearchParams(params);
  };

  const setActiveChart = (chart: ChartView) => {
    updateSearchParams("positioningChart", chart);
  };

  const { data: comparisonData, isLoading } = useFinanceAdvancedComparison(
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

  const filteredItems = usePositioningFilteredData(allItems, data, filters);

  const structureName =
    data?.etablissement_actuel_lib ||
    data?.etablissement_lib ||
    "l'établissement";

  const getChartLabel = () => {
    if (activeChart === "comparison") return "Comparaison par analyse";
    if (activeChart === "scatter-1") return "Produits vs Effectifs";
    if (activeChart === "scatter-2") return "SCSP vs Encadrement";
    if (activeChart === "scatter-3") return "SCSP vs Ressources";
    return "Comparaison par analyse";
  };

  const scatterConfigs = [
    {
      title: `Produits de fonctionnement encaissables vs Effectifs d'étudiants${
        selectedYear ? ` — ${selectedYear}` : ""
      }`,
      xMetric: "produits_de_fonctionnement_encaissables",
      yMetric: "effectif_sans_cpge",
      xLabel: "Produits de fonctionnement encaissables (€)",
      yLabel: "Effectif étudiants (sans CPGE)",
    },
    {
      title: `SCSP par étudiant vs Taux d'encadrement${
        selectedYear ? ` — ${selectedYear}` : ""
      }`,
      xMetric: "scsp_par_etudiants",
      yMetric: "taux_encadrement",
      xLabel: "SCSP par étudiant (€)",
      yLabel: "Taux d'encadrement (ETPT/étudiant)",
    },
    {
      title: `SCSP vs Ressources propres${
        selectedYear ? ` — ${selectedYear}` : ""
      }`,
      xMetric: "scsp",
      yMetric: "ressources_propres",
      xLabel: "SCSP (€)",
      yLabel: "Ressources propres (€)",
    },
  ];

  const metricKeys = useMemo(() => {
    if (activeChart === "comparison" && selectedAnalysis) {
      const analysisConfig = PREDEFINED_ANALYSES[selectedAnalysis];
      if (analysisConfig) {
        return analysisConfig.metrics.filter(
          (metric) =>
            !metric.includes("_ipc") && metric !== "effectif_sans_cpge_veto"
        );
      }
    } else if (activeChart === "scatter-1") {
      return ["produits_de_fonctionnement_encaissables", "effectif_sans_cpge"];
    } else if (activeChart === "scatter-2") {
      return ["scsp_par_etudiants", "taux_encadrement"];
    } else if (activeChart === "scatter-3") {
      return ["scsp", "ressources_propres"];
    }
    return [];
  }, [activeChart, selectedAnalysis]);

  return (
    <section
      id="section-positionnement"
      aria-labelledby="section-positionnement-title"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <Title
          as="h2"
          look="h5"
          id="section-positionnement-title"
          className="section-header__title"
        >
          Positionnement de {structureName}
        </Title>
        <Text className="fr-text--sm fr-text-mention--grey">
          Comparez {structureName} avec d'autres établissements.
        </Text>
      </div>

      {isLoading && <DefaultSkeleton height="400px" />}

      {!isLoading && allItems.length === 0 && (
        <div className="fr-alert fr-alert--warning fr-mb-4w" role="alert">
          <p className="fr-alert__title">Aucune donnée disponible</p>
          <p>
            Les données de comparaison ne sont pas disponibles pour l'année
            sélectionnée.
          </p>
        </div>
      )}

      {!isLoading && allItems.length > 0 && (
        <>
          <PositioningFilters
            data={allItems}
            currentStructure={data}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          <Row gutters className="fr-mb-3w">
            <Col xs="12" md="4" offsetMd="8" className="text-right">
              <Text className="fr-text--sm fr-text--bold fr-mb-1w">
                Type de graphique
              </Text>
              <Select label={getChartLabel()} icon="line-chart-line" size="sm">
                <Select.Checkbox
                  value="comparison"
                  checked={activeChart === "comparison"}
                  onChange={() => setActiveChart("comparison")}
                >
                  Comparaison par analyse
                </Select.Checkbox>
                <Select.Checkbox
                  value="scatter-1"
                  checked={activeChart === "scatter-1"}
                  onChange={() => setActiveChart("scatter-1")}
                >
                  Produits vs Effectifs
                </Select.Checkbox>
                <Select.Checkbox
                  value="scatter-2"
                  checked={activeChart === "scatter-2"}
                  onChange={() => setActiveChart("scatter-2")}
                >
                  SCSP vs Encadrement
                </Select.Checkbox>
                <Select.Checkbox
                  value="scatter-3"
                  checked={activeChart === "scatter-3"}
                  onChange={() => setActiveChart("scatter-3")}
                >
                  SCSP vs Ressources
                </Select.Checkbox>
              </Select>
            </Col>
          </Row>

          {filteredItems.length === 0 && (
            <div className="fr-alert fr-alert--warning fr-mb-4w" role="alert">
              <p className="fr-alert__title">Aucun résultat</p>
              <p>Aucun établissement ne correspond aux filtres sélectionnés.</p>
            </div>
          )}

          {filteredItems.length > 0 && (
            <div className="fr-mb-4w">
              {activeChart === "comparison" && (
                <Row gutters>
                  <Col xs="12" md="4">
                    <PositioningMetricFilter
                      data={filteredItems}
                      selectedAnalysis={selectedAnalysis}
                      selectedCategory={selectedCategory}
                      onSelectAnalysis={setSelectedAnalysis}
                      onSelectCategory={setSelectedCategory}
                    />
                  </Col>
                  <Col xs="12" md="8">
                    <PositioningComparisonBarChart
                      data={filteredItems}
                      currentStructure={data}
                      currentStructureId={data?.etablissement_id_paysage_actuel}
                      currentStructureName={structureName}
                      selectedYear={String(selectedYear)}
                      selectedAnalysis={selectedAnalysis}
                    />
                  </Col>
                </Row>
              )}
              {activeChart === "scatter-1" && (
                <PositioningScatterChart
                  config={scatterConfigs[0]}
                  data={filteredItems}
                  currentStructureId={data?.etablissement_id_paysage_actuel}
                  currentStructureName={structureName}
                />
              )}
              {activeChart === "scatter-2" && (
                <PositioningScatterChart
                  config={scatterConfigs[1]}
                  data={filteredItems}
                  currentStructureId={data?.etablissement_id_paysage_actuel}
                  currentStructureName={structureName}
                />
              )}
              {activeChart === "scatter-3" && (
                <PositioningScatterChart
                  config={scatterConfigs[2]}
                  data={filteredItems}
                  currentStructureId={data?.etablissement_id_paysage_actuel}
                  currentStructureName={structureName}
                />
              )}
            </div>
          )}

          <MetricDefinitionsTable metricKeys={metricKeys} />
        </>
      )}
    </section>
  );
}

import {
  Row,
  Col,
  Title,
  Text,
  SegmentedControl,
  SegmentedElement,
} from "@dataesr/dsfr-plus";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFinanceAdvancedComparison } from "../../../../api/api";
import PositioningFilters, {
  FilterMode,
} from "./components/positioning-filters";
import PositioningScatterChart from "./charts/positioning-scatter";
import PositioningComparisonBarChart from "./charts/positioning-comparison-bar";
import { usePositioningFilteredData } from "./hooks/usePositioningFilteredData";
import "../styles.scss";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import MetricDefinitionsTable from "../../../../components/layouts/metric-definitions-table";

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

  const filterMode =
    (searchParams.get("positioningFilter") as FilterMode) || "all";
  const activeChart =
    (searchParams.get("positioningChart") as ChartView) || "comparison";

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  };

  const setFilterMode = (mode: FilterMode) => {
    updateSearchParams("positioningFilter", mode);
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

  const filteredItems = usePositioningFilteredData(allItems, data, filterMode);

  const structureName =
    data?.etablissement_actuel_lib ||
    data?.etablissement_lib ||
    "l'établissement";

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
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
          />

          {filteredItems.length === 0 && (
            <div className="fr-alert fr-alert--warning fr-mb-4w" role="alert">
              <p className="fr-alert__title">Aucun résultat</p>
              <p>Aucun établissement ne correspond aux filtres sélectionnés.</p>
            </div>
          )}

          {filteredItems.length > 0 && (
            <div className="fr-mb-4w">
              <fieldset className="fr-fieldset fr-mb-3w">
                <legend className="fr-sr-only">
                  Choisir le type de graphique
                </legend>
                <SegmentedControl
                  className="fr-segmented--sm"
                  name="positioning-chart-selector"
                >
                  <SegmentedElement
                    checked={activeChart === "comparison"}
                    label="Comparaison par métrique"
                    onClick={() => setActiveChart("comparison")}
                    value="comparison"
                  />
                  <SegmentedElement
                    checked={activeChart === "scatter-1"}
                    label="Produits vs Effectifs"
                    onClick={() => setActiveChart("scatter-1")}
                    value="scatter-1"
                  />
                  <SegmentedElement
                    checked={activeChart === "scatter-2"}
                    label="SCSP vs Encadrement"
                    onClick={() => setActiveChart("scatter-2")}
                    value="scatter-2"
                  />
                  <SegmentedElement
                    checked={activeChart === "scatter-3"}
                    label="SCSP vs Ressources"
                    onClick={() => setActiveChart("scatter-3")}
                    value="scatter-3"
                  />
                </SegmentedControl>
              </fieldset>

              <Row className="fr-mb-4w">
                <Col xs="12">
                  {activeChart === "comparison" && (
                    <PositioningComparisonBarChart
                      data={filteredItems}
                      currentStructureId={data?.etablissement_id_paysage_actuel}
                      currentStructureName={structureName}
                      selectedYear={String(selectedYear)}
                    />
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
                </Col>
              </Row>
            </div>
          )}

          <MetricDefinitionsTable
            metricKeys={[
              "produits_de_fonctionnement_encaissables",
              "effectif_sans_cpge",
              "scsp_par_etudiants",
              "taux_encadrement",
              "scsp",
              "ressources_propres",
            ]}
          />
        </>
      )}
    </section>
  );
}

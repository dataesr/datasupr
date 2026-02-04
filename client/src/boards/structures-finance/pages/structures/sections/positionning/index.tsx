import { useSearchParams } from "react-router-dom";
import { Row, Col } from "@dataesr/dsfr-plus";
import { PositionningSectionWrapper } from "./components/section-wrapper";
import PositioningCharts, { type ChartView } from "./charts";
import PositioningFiltersPanel from "./filters-container/filters";
import ChartTypeSelector from "./chart-type-selector";
import AnalysisFilter from "./analysis-filter";
import { usePositioningData, type PositioningFilters } from "../../hooks";
import { type AnalysisKey } from "../../../../config/config";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import "../styles.scss";

interface PositionnementSectionProps {
  data: any;
  selectedYear?: string | number;
}

export function PositionnementSection({
  data,
  selectedYear,
}: PositionnementSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string, defaultValue = "") =>
    searchParams.get(key) || defaultValue;

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    value ? params.set(key, value) : params.delete(key);
    setSearchParams(params, { replace: true });
  };

  const filters: PositioningFilters = {
    type: getParam("filterType"),
    typologie: getParam("filterTypologie"),
    region: getParam("filterRegion"),
    rce: getParam("filterRce"),
    devimmo: getParam("filterDevimmo"),
  };

  const setFilters = (newFilters: PositioningFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      const paramKey = `filter${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      value ? params.set(paramKey, value) : params.delete(paramKey);
    });
    setSearchParams(params, { replace: true });
  };

  const selectedAnalysis = getParam(
    "analysis",
    "ressources-total"
  ) as AnalysisKey;
  const activeChart = getParam("chart", "comparison") as ChartView;

  const { allItems, filteredItems, isLoading } = usePositioningData(
    selectedYear,
    data,
    filters
  );

  const structureName =
    data?.etablissement_actuel_lib ||
    data?.etablissement_lib ||
    "l'établissement";

  if (isLoading) {
    return (
      <PositionningSectionWrapper structureName={structureName}>
        <DefaultSkeleton />
      </PositionningSectionWrapper>
    );
  }

  if (allItems.length === 0) {
    return (
      <PositionningSectionWrapper structureName={structureName}>
        <div className="fr-alert fr-alert--warning">
          <p>
            Les données de comparaison ne sont pas disponibles pour l'année
            sélectionnée.
          </p>
        </div>
      </PositionningSectionWrapper>
    );
  }

  return (
    <PositionningSectionWrapper structureName={structureName}>
      <PositioningFiltersPanel
        data={allItems}
        currentStructure={data}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ChartTypeSelector
        activeChart={activeChart}
        onChartChange={(c) => setParam("chart", c)}
      />

      {filteredItems.length === 0 ? (
        <div className="fr-alert fr-alert--warning">
          <p>Aucun établissement ne correspond aux filtres sélectionnés.</p>
        </div>
      ) : (
        <>
          {activeChart === "comparison" ? (
            <Row gutters>
              <Col xs="12" md="4">
                <AnalysisFilter
                  data={filteredItems}
                  selectedAnalysis={selectedAnalysis}
                  onSelectAnalysis={(a) => setParam("analysis", a)}
                />
              </Col>
              <Col xs="12" md="8">
                <PositioningCharts
                  activeChart={activeChart}
                  data={filteredItems}
                  currentStructureId={data?.etablissement_id_paysage_actuel}
                  currentStructureName={structureName}
                  selectedYear={selectedYear}
                  selectedAnalysis={selectedAnalysis}
                />
              </Col>
            </Row>
          ) : (
            <PositioningCharts
              activeChart={activeChart}
              data={filteredItems}
              currentStructureId={data?.etablissement_id_paysage_actuel}
              currentStructureName={structureName}
              selectedYear={selectedYear}
              selectedAnalysis={selectedAnalysis}
            />
          )}
        </>
      )}
    </PositionningSectionWrapper>
  );
}

import { PositionningSectionWrapper } from "./components/section-wrapper";
import PositioningFilters from "./components/filters-container/filters";
import ChartTypeSelector from "./components/chart-type-selector";
import PositioningCharts from "./charts";
import { usePositioningData } from "../../hooks";
import { usePositioningParams } from "./hooks";
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
  const {
    filters,
    setFilters,
    selectedAnalysis,
    setSelectedAnalysis,
    activeChart,
    setActiveChart,
  } = usePositioningParams();

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
      <PositioningFilters
        data={allItems}
        currentStructure={data}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ChartTypeSelector
        activeChart={activeChart}
        onChartChange={setActiveChart}
      />

      {filteredItems.length === 0 ? (
        <div className="fr-alert fr-alert--warning">
          <p>Aucun établissement ne correspond aux filtres sélectionnés.</p>
        </div>
      ) : (
        <PositioningCharts
          activeChart={activeChart}
          data={filteredItems}
          allData={allItems}
          currentStructure={data}
          selectedYear={selectedYear}
          selectedAnalysis={selectedAnalysis}
          onSelectAnalysis={setSelectedAnalysis}
          activeFilters={filters}
        />
      )}
    </PositionningSectionWrapper>
  );
}

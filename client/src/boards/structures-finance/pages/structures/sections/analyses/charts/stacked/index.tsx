import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import MetricDefinitionsTable from "../../../../../../components/metric-definitions/metric-definitions-table";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import { RenderDataStacked } from "../render-data";
import { createStackedChartOptions } from "./options";
import { METRICS_CONFIG } from "../../../../../../config/config";
import type { MetricKey } from "../../../../../../config/config";

interface StackedEvolutionChartProps {
  etablissementId: string;
  selectedMetrics: MetricKey[];
  chartConfig: any;
  displayMode: "values" | "percentage";
  onDisplayModeChange: (mode: "values" | "percentage") => void;
  xAxisField: "exercice" | "anuniv";
}

export default function StackedEvolutionChart({
  etablissementId,
  selectedMetrics,
  chartConfig,
  displayMode,
  onDisplayModeChange,
  xAxisField,
}: StackedEvolutionChartProps) {
  const { data } = useFinanceEtablissementEvolution(etablissementId);

  const chartOptions = createStackedChartOptions(
    data || [],
    selectedMetrics,
    METRICS_CONFIG,
    displayMode === "percentage",
    xAxisField
  );

  if (!data || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <>
      <div className="fr-mb-2w">
        <SegmentedControl
          className="fr-segmented--sm"
          name="evolution-stacked-mode"
        >
          <SegmentedElement
            checked={displayMode === "values"}
            label="Valeurs"
            onClick={() => onDisplayModeChange("values")}
            value="values"
          />
          <SegmentedElement
            checked={displayMode === "percentage"}
            label="Part %"
            onClick={() => onDisplayModeChange("percentage")}
            value="percentage"
          />
        </SegmentedControl>
      </div>

      <ChartWrapper
        config={chartConfig}
        options={chartOptions}
        renderData={() => (
          <RenderDataStacked
            data={data}
            metrics={selectedMetrics}
            metricsConfig={METRICS_CONFIG}
          />
        )}
      />
      <MetricDefinitionsTable metricKeys={selectedMetrics} />
    </>
  );
}

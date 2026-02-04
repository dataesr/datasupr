import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createPositioningScatterOptions, ScatterConfig } from "./options";
import { RenderData } from "./render-data";

interface ScatterChartProps {
  config?: ScatterConfig;
  data?: any[];
  currentStructureId?: string;
  currentStructureName?: string;
  selectedYear?: string | number;
}

export default function ScatterChart({
  config,
  data = [],
  currentStructureId,
  currentStructureName = "",
  selectedYear,
}: ScatterChartProps) {
  if (!config) {
    return;
  }

  const chartOptions = useMemo(() => {
    return createPositioningScatterOptions(
      config,
      data,
      currentStructureId,
      currentStructureName
    );
  }, [config, data, currentStructureId, currentStructureName]);

  const chartKey = useMemo(() => {
    if (!data || !Array.isArray(data))
      return `${config.xMetric}-${config.yMetric}`;
    const dataIds = data
      .map((d) => d?.etablissement_id_paysage_actuel)
      .sort()
      .join(",");
    return `${config.xMetric}-${config.yMetric}-${currentStructureId}-${dataIds}`;
  }, [config.xMetric, config.yMetric, currentStructureId, data]);

  // Check if current structure has data for both metrics
  const currentStructureHasData = useMemo(() => {
    if (!data?.length || !currentStructureId) return false;
    const currentStructureData = data.find(
      (item) => item.etablissement_id_paysage_actuel === currentStructureId
    );
    if (!currentStructureData) return false;
    const xValue = currentStructureData[config.xMetric];
    const yValue = currentStructureData[config.yMetric];
    return xValue != null && xValue !== 0 && yValue != null && yValue !== 0;
  }, [data, currentStructureId, config.xMetric, config.yMetric]);

  if (!data || data.length === 0 || !currentStructureHasData) {
    return (
      <div className="fr-alert fr-alert--warning">
        <p className="fr-alert__title">Aucune donnée disponible</p>
        <p>
          Aucune donnée disponible pour{" "}
          {currentStructureName || "l'établissement"}
          {selectedYear ? ` en ${selectedYear}` : ""}.
        </p>
      </div>
    );
  }

  const chartConfig = {
    id: `positioning-scatter-${config.xMetric}-${config.yMetric}`,
    title: config.title,
  };

  return (
    <ChartWrapper
      key={chartKey}
      config={chartConfig}
      options={chartOptions}
      renderData={() => (
        <RenderData
          config={config}
          data={data}
          currentStructureId={currentStructureId}
          currentStructureName={currentStructureName}
        />
      )}
    />
  );
}

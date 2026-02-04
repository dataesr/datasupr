import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createPositioningScatterOptions, ScatterConfig } from "./options";
import { RenderData } from "./render-data";

interface ScatterChartProps {
  config?: ScatterConfig;
  data?: any[];
  currentStructureId?: string;
  currentStructureName?: string;
}

export default function ScatterChart({
  config,
  data = [],
  currentStructureId,
  currentStructureName = "",
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

  if (!data || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--warning">
        <p className="fr-alert__title">Aucune donnée disponible</p>
        <p>Aucune donnée n'est disponible pour ce graphique.</p>
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

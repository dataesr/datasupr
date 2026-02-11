import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import {
  createComparisonScatterOptions,
  type ComparisonScatterConfig,
  type ScatterDataset,
} from "./options";
import { RenderData } from "./render-data";

interface ComparisonScatterChartProps {
  config: ComparisonScatterConfig;
  datasets: ScatterDataset[];
  currentStructureId?: string;
  currentStructureName?: string;
}

export default function ComparisonScatterChart({
  config,
  datasets,
  currentStructureId,
  currentStructureName = "",
}: ComparisonScatterChartProps) {
  const hasData = useMemo(() => {
    if (!datasets?.length || !currentStructureId) return false;
    return datasets.some((ds) =>
      ds.data.some(
        (item) =>
          item.etablissement_id_paysage_actuel === currentStructureId &&
          item[config.metric] != null &&
          item[config.metric] !== 0
      )
    );
  }, [datasets, currentStructureId, config.metric]);

  const chartOptions = useMemo(
    () =>
      createComparisonScatterOptions(
        config,
        datasets,
        currentStructureId,
        currentStructureName
      ),
    [config, datasets, currentStructureId, currentStructureName]
  );

  const chartKey = useMemo(() => {
    const ids = datasets
      .flatMap((ds) => ds.data)
      .map((d) => d?.etablissement_id_paysage_actuel)
      .sort()
      .join(",");
    return `${config.metric}-${currentStructureId}-${ids}`;
  }, [config.metric, currentStructureId, datasets]);

  const combinedData = useMemo(() => {
    const seen = new Set<string>();
    const combined: any[] = [];
    datasets.forEach((ds) =>
      ds.data.forEach((item) => {
        const id = item.etablissement_id_paysage_actuel;
        if (id && !seen.has(id)) {
          seen.add(id);
          combined.push(item);
        }
      })
    );
    return combined;
  }, [datasets]);

  if (!hasData) return null;

  return (
    <ChartWrapper
      key={chartKey}
      config={{ id: `comparison-scatter-${config.metric}` }}
      options={chartOptions}
      renderData={() => (
        <RenderData
          config={config}
          data={combinedData}
          currentStructureId={currentStructureId}
          currentStructureName={currentStructureName}
        />
      )}
    />
  );
}

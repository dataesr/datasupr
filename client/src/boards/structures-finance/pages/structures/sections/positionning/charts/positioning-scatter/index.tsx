import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createPositioningScatterOptions, ScatterConfig } from "./options";
import { RenderData } from "./render-data";

interface PositioningScatterChartProps {
  config: ScatterConfig;
  data: any[];
  currentStructureId?: string;
  currentStructureName?: string;
}

export default function PositioningScatterChart({
  config,
  data,
  currentStructureId,
  currentStructureName,
}: PositioningScatterChartProps) {
  const [searchParams] = useSearchParams();
  const structureId = searchParams.get("structureId") || "";
  const selectedYear = searchParams.get("year") || "";
  const positioningFilter = searchParams.get("positioningFilter") || "all";
  const positioningChart = searchParams.get("positioningChart") || "comparison";

  const chartOptions = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return {};
    }
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

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--warning">
        <p className="fr-alert__title">Aucune donnée disponible</p>
        <p>Aucune donnée n'est disponible pour ce graphique.</p>
      </div>
    );
  }

  const chartConfig = {
    id: `positioning-scatter-${config.xMetric}-${config.yMetric}`,
    integrationURL: `/integration?chart_id=positioning-scatter&structureId=${structureId}&year=${selectedYear}&xMetric=${config.xMetric}&yMetric=${config.yMetric}&filter=${positioningFilter}&chart=${positioningChart}`,
    title: `${config.title}${currentStructureName ? ` — ${currentStructureName}` : ""}`,
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

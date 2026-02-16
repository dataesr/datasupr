import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import {
  createComparisonOverviewOptions,
  type ComparisonOverviewConfig,
  type OverviewDataset,
} from "./options";
import { RenderData } from "./render-data";

interface ComparisonOverviewChartProps {
  config: ComparisonOverviewConfig;
  allData: any[];
  filterDataByCriteria: (criterion: "type" | "typologie" | "region") => any[];
  currentStructure?: any;
  currentStructureId?: string;
  showAll: boolean;
  showRegion: boolean;
  showType: boolean;
  showTypologie: boolean;
}

export default function ComparisonOverviewChart({
  config,
  allData,
  filterDataByCriteria,
  currentStructure,
  currentStructureId,
  showAll,
  showRegion,
  showType,
  showTypologie,
}: ComparisonOverviewChartProps) {
  const datasets = useMemo(() => {
    const ds: OverviewDataset[] = [];

    if (showAll) {
      ds.push({ data: allData, label: "Tous les établissements" });
    }
    if (showRegion) {
      const regionLabel =
        currentStructure?.etablissement_actuel_region ||
        currentStructure?.region ||
        "";
      ds.push({
        data: filterDataByCriteria("region"),
        label: `Même région (${regionLabel})`,
      });
    }
    if (showType) {
      const typeLabel =
        currentStructure?.etablissement_actuel_type ||
        currentStructure?.type ||
        "";
      ds.push({
        data: filterDataByCriteria("type"),
        label: `Même type (${typeLabel})`,
      });
    }
    if (showTypologie) {
      const typoLabel =
        currentStructure?.etablissement_actuel_typologie ||
        currentStructure?.typologie ||
        "";
      ds.push({
        data: filterDataByCriteria("typologie"),
        label: `Même typologie (${typoLabel})`,
      });
    }

    return ds;
  }, [
    allData,
    filterDataByCriteria,
    currentStructure,
    showAll,
    showRegion,
    showType,
    showTypologie,
  ]);

  const hasData = useMemo(() => {
    if (!datasets.length || !currentStructureId) return false;
    return datasets.some((ds) =>
      ds.data.some(
        (item) =>
          item.etablissement_id_paysage_actuel === currentStructureId &&
          item[config.metric] != null &&
          item[config.metric] !== 0
      )
    );
  }, [datasets, currentStructureId, config.metric]);

  const currentStructureName =
    currentStructure?.etablissement_actuel_lib ||
    currentStructure?.etablissement_lib ||
    undefined;

  const chartOptions = useMemo(
    () =>
      createComparisonOverviewOptions(
        config,
        datasets,
        currentStructureId,
        currentStructureName
      ),
    [config, datasets, currentStructureId, currentStructureName]
  );

  if (!hasData) return null;

  return (
    <ChartWrapper
      config={{
        id: `comparison-overview-${config.metric}`,
        title: `${config.metricLabel} - Positionnement de ${currentStructureName || "l'établissement"} pour l'année ${config.metricConfig.year}`,
      }}
      options={chartOptions}
      renderData={() => (
        <RenderData
          config={config}
          datasets={datasets}
          currentStructureId={currentStructureId}
        />
      )}
    />
  );
}

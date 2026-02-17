import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import {
  createComparisonOverviewOptions,
  type ComparisonOverviewConfig,
  type OverviewDataset,
} from "./options";
import { RenderData } from "./render-data";

function buildComment(
  config: ComparisonOverviewConfig,
  structureName?: string
) {
  const isAugmentation = config.sens === "augmentation";
  const order = isAugmentation ? "croissant" : "décroissant";
  const orderAdj = isAugmentation
    ? "de la plus petite valeur à la plus grande"
    : "de la plus grande valeur à la plus petite";

  return (
    <p
      className="fr-text--xs fr-mb-0"
      style={{ color: "var(--text-mention-grey)" }}
    >
      Ce graphique montre la répartition des valeurs de l'indicateur «&nbsp;
      {config.metricLabel.toLowerCase()}&nbsp;» parmi les établissements
      d'enseignement supérieur, classées {orderAdj}. Chaque courbe relie les
      points correspondant à chaque établissement, dans l'ordre {order} des
      valeurs. Les extrémités de chaque courbe montrent les valeurs minimales et
      maximales pour chaque regroupement d'établissements. Les losanges
      indiquent la position de {structureName || "l'établissement"} en{" "}
      {config.metricConfig.year} par rapport aux autres établissements. L'axe
      vertical (50&nbsp;%) permet de repérer la médiane&nbsp;: la moitié des
      établissements ont des valeurs supérieures à cette valeur, et l'autre
      moitié des valeurs inférieures.
    </p>
  );
}

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
        comment: { fr: buildComment(config, currentStructureName) },
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

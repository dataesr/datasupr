import { useMemo } from "react";
import { Badge, Text } from "@dataesr/dsfr-plus";
import ComparisonScatterChart from "../scatter-comparision";
import RankingScatterChart from "../scatter-ranking";
import {
  getMetricStatus,
  STATUS_BADGE_CONFIG,
} from "../../../../../../components/metric-status";
import { calculateRank } from "../../../../../../components/metric-sort";
import type { ThresholdConfig } from "../../../../../../config";
import type { ScatterDataset } from "../scatter-comparision/options";
import {
  formatMetricValue,
  type MetricConfig,
} from "../../../../../../utils/utils";
import "./comparison-summary-card.scss";

interface ComparisonSummaryCardProps {
  allData: any[];
  filterDataByCriteria: (criterion: "type" | "typologie" | "region") => any[];
  metric: string;
  metricConfig: MetricConfig;
  metricLabel: string;
  currentStructure?: any;
  currentStructureId?: string;
  currentStructureName?: string;
  selectedYear?: string;
  metricSens?: "augmentation" | "diminution" | null;
  metricThreshold?: ThresholdConfig | null;
  showAllCard: boolean;
  showRegionCard: boolean;
  showTypeCard: boolean;
  showTypologieCard: boolean;
}

export default function ComparisonSummaryCard({
  allData,
  filterDataByCriteria,
  metric,
  metricConfig,
  metricLabel,
  currentStructure,
  currentStructureId,
  currentStructureName,
  selectedYear,
  metricSens,
  showAllCard,
  showRegionCard,
  showTypeCard,
  showTypologieCard,
}: ComparisonSummaryCardProps) {
  const stats = useMemo(() => {
    if (!allData?.length || !currentStructureId) return null;

    const currentItem = allData.find(
      (item) => item.etablissement_id_paysage_actuel === currentStructureId
    );
    if (!currentItem) return null;

    const currentValue = currentItem[metric];
    if (currentValue == null || currentValue === 0) return null;

    const validValues = allData
      .map((item) => item[metric])
      .filter((v) => v != null && !isNaN(v) && v !== 0)
      .sort((a, b) => a - b);

    if (validValues.length === 0) return null;

    const rank = calculateRank(validValues, currentValue, metricSens ?? null);
    const min = validValues[0];
    const max = validValues[validValues.length - 1];

    return {
      currentValue,
      currentStatus: getMetricStatus(currentItem, metric),
      min,
      max,
      rank,
      total: validValues.length,
    };
  }, [allData, metric, currentStructureId, metricSens]);

  const scatterDatasets = useMemo(() => {
    const datasets: ScatterDataset[] = [];

    if (showAllCard) {
      datasets.push({
        data: allData,
        label: "Tous les établissements",
        color: "var(--background-action-high-blue-france)",
      });
    }
    if (showRegionCard) {
      const regionLabel =
        currentStructure?.etablissement_actuel_region ||
        currentStructure?.region;
      datasets.push({
        data: filterDataByCriteria("region"),
        label: `Même région (${regionLabel})`,
        color: "var(--background-action-high-error)",
      });
    }
    if (showTypeCard) {
      const typeLabel =
        currentStructure?.etablissement_actuel_type || currentStructure?.type;
      datasets.push({
        data: filterDataByCriteria("type"),
        label: `Même type (${typeLabel})`,
        color: "var(--background-action-high-success)",
      });
    }
    if (showTypologieCard) {
      const typoLabel =
        currentStructure?.etablissement_actuel_typologie ||
        currentStructure?.typologie;
      datasets.push({
        data: filterDataByCriteria("typologie"),
        label: `Même typologie (${typoLabel})`,
        color: "var(--background-action-high-warning)",
      });
    }

    return datasets;
  }, [
    showAllCard,
    showRegionCard,
    showTypeCard,
    showTypologieCard,
    allData,
    filterDataByCriteria,
    currentStructure,
  ]);

  if (!stats) return null;

  return (
    <div className="comparison-summary-card fr-p-3w fr-mb-4w">
      <div className="card-header fr-mb-3w">
        <Text bold className="fr-mb-0">
          {metricLabel} - {selectedYear}
        </Text>
        {stats.currentStatus && (
          <Badge
            size="sm"
            className={STATUS_BADGE_CONFIG[stats.currentStatus].className}
          >
            {STATUS_BADGE_CONFIG[stats.currentStatus].label}
          </Badge>
        )}
      </div>

      <div className="card-labels fr-mb-1v">
        <Text size="xs" className="fr-mb-0">
          Minimum
        </Text>
        <Text bold className="fr-mb-0">
          {currentStructureName}
        </Text>
        <Text size="sm" className="fr-mb-0">
          Maximum
        </Text>
      </div>
      <div className="card-values fr-mb-2w">
        <Text size="xs" className="fr-text-mention--grey fr-mb-0">
          {formatMetricValue(stats.min, metricConfig.format)}
        </Text>
        <Text bold className="fr-text-title--blue-france fr-mb-0">
          {formatMetricValue(stats.currentValue, metricConfig.format)}
        </Text>
        <Text size="xs" className="fr-text-mention--grey fr-mb-0">
          {formatMetricValue(stats.max, metricConfig.format)}
        </Text>
      </div>

      <div className="rank-display fr-mb-2w fr-mt-3w">
        <Text bold className="fr-text-title--blue-france fr-mb-0">
          Positionnement : {stats.rank}
          <sup>{stats.rank === 1 ? "er" : "e"}</sup> / {stats.total}
        </Text>
      </div>
      <div className="fr-mb-3w">
        <RankingScatterChart
          rank={stats.rank}
          total={stats.total}
          currentStructureName={currentStructureName}
        />
      </div>
      <ComparisonScatterChart
        config={{
          title: metricLabel,
          metric,
          label: metricLabel,
          format: metricConfig.format,
        }}
        datasets={scatterDatasets}
        currentStructureId={currentStructureId}
        currentStructureName={currentStructureName}
      />
    </div>
  );
}

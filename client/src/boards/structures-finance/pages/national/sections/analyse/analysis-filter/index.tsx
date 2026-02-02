import { useMemo } from "react";
import ItemFilter, {
  type FilterItem,
} from "../../../../../components/item-filter";
import {
  PREDEFINED_ANALYSES,
  type AnalysisKey,
} from "../../../../structures/sections/analyses/charts/evolution/config";

interface AnalysisFilterProps {
  selectedAnalysis: AnalysisKey | null;
  selectedCategory: string;
  onSelectAnalysis: (analysis: AnalysisKey) => void;
  onSelectCategory: (category: string) => void;
}

export default function AnalysisFilter({
  selectedAnalysis,
  selectedCategory,
  onSelectAnalysis,
  onSelectCategory,
}: AnalysisFilterProps) {
  const items: FilterItem[] = useMemo(() => {
    return Object.entries(PREDEFINED_ANALYSES)
      .filter(([_, analysis]) => {
        if (analysis.showBase100) return false;

        const hasNonIpcMetric = analysis.metrics.some(
          (metric) => !metric.includes("_ipc")
        );
        return hasNonIpcMetric;
      })
      .map(([key, analysis]) => ({
        key,
        label: analysis.label,
        category: analysis.category,
      }));
  }, []);

  const availableKeys = useMemo(() => {
    return new Set(items.map((item) => item.key));
  }, [items]);

  return (
    <ItemFilter
      title="Analyses disponibles"
      items={items}
      availableKeys={availableKeys}
      selectedKey={selectedAnalysis}
      selectedCategory={selectedCategory}
      onSelectItem={(key) => onSelectAnalysis(key as AnalysisKey)}
      onSelectCategory={onSelectCategory}
    />
  );
}

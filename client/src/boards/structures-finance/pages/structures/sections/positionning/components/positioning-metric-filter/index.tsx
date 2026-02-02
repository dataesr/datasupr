import { useMemo } from "react";
import ItemFilter, {
  type FilterItem,
} from "../../../../../../components/item-filter";
import {
  PREDEFINED_ANALYSES,
  type AnalysisKey,
} from "../../../analyses/charts/evolution/config";

interface PositioningMetricFilterProps {
  data: any[];
  selectedAnalysis: AnalysisKey | null;
  selectedCategory: string;
  onSelectAnalysis: (analysis: AnalysisKey) => void;
  onSelectCategory: (category: string) => void;
}

export default function PositioningMetricFilter({
  data,
  selectedAnalysis,
  selectedCategory,
  onSelectAnalysis,
  onSelectCategory,
}: PositioningMetricFilterProps) {
  const items: FilterItem[] = useMemo(() => {
    return Object.entries(PREDEFINED_ANALYSES)
      .filter(([, analysis]) => !analysis.showBase100)
      .map(([key, analysis]) => ({
        key,
        label: analysis.label,
        category: analysis.category,
        hint: analysis.showBase100 ? "base 100" : undefined,
      }));
  }, []);

  const availableKeys = useMemo(() => {
    if (!data || !Array.isArray(data)) return new Set<string>();

    const available = Object.keys(PREDEFINED_ANALYSES).filter((key) => {
      const analysis = PREDEFINED_ANALYSES[key as AnalysisKey];
      if (analysis.showBase100) return false;
      return analysis.metrics.some((metricKey) => {
        return data.some((item) => {
          const value = item[metricKey];
          return value != null && !isNaN(value) && value > 0;
        });
      });
    });

    return new Set(available);
  }, [data]);

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

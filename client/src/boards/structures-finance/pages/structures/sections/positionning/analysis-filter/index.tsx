import { useMemo, useState } from "react";
import ItemFilter, {
  type FilterItem,
} from "../../../../../components/item-filter";
import {
  PREDEFINED_ANALYSES,
  type AnalysisKey,
} from "../../../../../config/config";

interface AnalysisFilterProps {
  data: any[];
  selectedAnalysis: AnalysisKey | null;
  onSelectAnalysis: (analysis: AnalysisKey) => void;
}

export default function AnalysisFilter({
  data,
  selectedAnalysis,
  onSelectAnalysis,
}: AnalysisFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "Ressources financières"
  );

  const items: FilterItem[] = useMemo(() => {
    return Object.entries(PREDEFINED_ANALYSES)
      .filter(([, analysis]) => !analysis.showBase100)
      .map(([key, analysis]) => ({
        key,
        label: analysis.label,
        category: analysis.category,
      }));
  }, []);

  const availableKeys = useMemo(() => {
    if (!data || !Array.isArray(data)) return new Set<string>();

    const available = Object.keys(PREDEFINED_ANALYSES).filter((key) => {
      const analysis = PREDEFINED_ANALYSES[key as AnalysisKey];
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
      onSelectCategory={setSelectedCategory}
    />
  );
}

import { useMemo } from "react";
import ItemFilter, {
  type FilterItem,
} from "../../../../../components/item-filter";
import {
  PREDEFINED_ANALYSES,
  type AnalysisKey,
} from "../../../../../config/config";

interface AnalysisFilterProps {
  analysesWithData: Set<AnalysisKey>;
  selectedAnalysis: AnalysisKey | null;
  selectedCategory: string;
  onSelectAnalysis: (analysis: AnalysisKey) => void;
  onSelectCategory: (category: string) => void;
}

export default function AnalysisFilter({
  analysesWithData,
  selectedAnalysis,
  selectedCategory,
  onSelectAnalysis,
  onSelectCategory,
}: AnalysisFilterProps) {
  const items: FilterItem[] = useMemo(() => {
    return Object.entries(PREDEFINED_ANALYSES).map(([key, analysis]) => ({
      key,
      label: analysis.label,
      category: analysis.category,
      hint: analysis.showBase100 ? "base 100" : undefined,
    }));
  }, []);

  return (
    <ItemFilter
      title="Analyses disponibles"
      items={items}
      availableKeys={analysesWithData as Set<string>}
      selectedKey={selectedAnalysis}
      selectedCategory={selectedCategory}
      onSelectItem={(key) => onSelectAnalysis(key as AnalysisKey)}
      onSelectCategory={onSelectCategory}
    />
  );
}

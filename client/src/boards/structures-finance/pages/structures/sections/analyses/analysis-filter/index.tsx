import { useMemo, useState } from "react";
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
  onSelectAnalysis: (analysis: AnalysisKey) => void;
}

export default function AnalysisFilter({
  analysesWithData,
  selectedAnalysis,
  onSelectAnalysis,
}: AnalysisFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "Ressources financières"
  );
  const items: FilterItem[] = useMemo(() => {
    return Object.entries(PREDEFINED_ANALYSES).map(([key, analysis]) => ({
      key,
      label: analysis.label,
      category: analysis.category,
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
      onSelectCategory={setSelectedCategory}
    />
  );
}

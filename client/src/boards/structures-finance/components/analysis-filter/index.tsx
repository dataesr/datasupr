import { useMemo } from "react";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import {} from "../../pages/structures/sections/analyses/charts/evolution";
import "./styles.scss";
import {
  AnalysisKey,
  PREDEFINED_ANALYSES,
} from "../../pages/structures/sections/analyses/charts/evolution/config";

interface AnalysisFilterProps {
  analysesWithData: Set<AnalysisKey>;
  selectedAnalysis: AnalysisKey | null;
  selectedCategory: string;
  periodText: string;
  onSelectAnalysis: (analysis: AnalysisKey) => void;
  onSelectCategory: (category: string) => void;
}

export default function AnalysisFilter({
  analysesWithData,
  selectedAnalysis,
  selectedCategory,
  periodText,
  onSelectAnalysis,
  onSelectCategory,
}: AnalysisFilterProps) {
  const categories = useMemo(() => {
    const cats = new Set(
      Array.from(analysesWithData).map(
        (key) => PREDEFINED_ANALYSES[key].category
      )
    );
    return Array.from(cats);
  }, [analysesWithData]);

  const availableAnalyses = useMemo(() => {
    const analysesArray = Array.from(analysesWithData);
    if (selectedCategory === "all") {
      return analysesArray;
    }
    return analysesArray.filter(
      (key) => PREDEFINED_ANALYSES[key].category === selectedCategory
    );
  }, [selectedCategory, analysesWithData]);

  return (
    <div className="analysis-filter fr-p-2w fr-background-alt--grey">
      <h3 className="fr-h6 fr-mb-2w">Sélection de l'analyse</h3>

      <p className="fr-text--xs fr-mb-2w fr-text-mention--grey">
        Période : {periodText} • {analysesWithData.size} analyses
      </p>

      <SegmentedControl
        name="analysis-category"
        className="fr-mb-2w fr-segmented--sm"
      >
        {categories.map((cat) => (
          <SegmentedElement
            key={cat}
            checked={selectedCategory === cat}
            label={cat}
            onClick={() => onSelectCategory(cat)}
            value={cat}
          />
        ))}
      </SegmentedControl>

      <div className="analysis-filter__list">
        {availableAnalyses.map((analysisKey) => {
          const analysis = PREDEFINED_ANALYSES[analysisKey];
          const isSelected = selectedAnalysis === analysisKey;

          return (
            <button
              key={analysisKey}
              onClick={() => onSelectAnalysis(analysisKey)}
              className={`analysis-filter__item ${isSelected ? "analysis-filter__item--selected" : ""}`}
            >
              {analysis.label}
              {analysis.showBase100 && (
                <span className="analysis-filter__comparison-badge">
                  (comparaison)
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

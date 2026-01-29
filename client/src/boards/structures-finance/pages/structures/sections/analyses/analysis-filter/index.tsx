import { useMemo } from "react";
import { Title } from "@dataesr/dsfr-plus";
import Select from "../../../../../../../components/select";
import "./styles.scss";
import { AnalysisKey, PREDEFINED_ANALYSES } from "../charts/evolution/config";

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
    <aside className="analysis-filter" aria-label="Filtres d'analyse">
      <Title as="h3" look="h6" className="fr-mb-1w">
        Analyses disponibles
        <span className="analysis-filter__count">
          ({analysesWithData.size})
        </span>
      </Title>

      <Select label={selectedCategory} size="sm" fullWidth className="fr-mb-2w">
        {categories.map((cat) => (
          <Select.Checkbox
            key={cat}
            value={cat}
            checked={selectedCategory === cat}
            onChange={() => onSelectCategory(cat)}
          >
            {cat}
          </Select.Checkbox>
        ))}
      </Select>

      <fieldset className="analysis-filter__analyses">
        <legend className="fr-sr-only">Sélectionner une analyse</legend>
        <div className="analysis-filter__list">
          {availableAnalyses.map((analysisKey) => {
            const analysis = PREDEFINED_ANALYSES[analysisKey];
            const isSelected = selectedAnalysis === analysisKey;

            return (
              <button
                key={analysisKey}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectAnalysis(analysisKey)}
                className={`analysis-filter__item ${isSelected ? "analysis-filter__item--selected" : ""}`}
              >
                <span className="analysis-filter__item-label">
                  {analysis.label}
                </span>
                {analysis.showBase100 && (
                  <span className="analysis-filter__item-hint">base 100</span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>
    </aside>
  );
}

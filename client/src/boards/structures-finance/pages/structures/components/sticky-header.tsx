import { Badge } from "@dataesr/dsfr-plus";
import "../styles.scss";

interface StickyHeaderProps {
  currentName: string;
  historicalName?: string;
  showMergedBadge: boolean;
  showYearSelector: boolean;
  years: (string | number)[];
  selectedYear: string | number;
  onYearChange: (year: string) => void;
}

export default function StickyHeader({
  currentName,
  historicalName,
  showMergedBadge,
  showYearSelector,
  years,
  selectedYear,
  onYearChange,
}: StickyHeaderProps) {
  return (
    <div className="structures-sticky-header">
      <div className="structures-header-content">
        {historicalName && historicalName !== currentName && (
          <p className="fr-text--lg fr-mb-0 structures-header-title">
            {historicalName}
          </p>
        )}
        <p className="fr-text--lg fr-mb-0 structures-header-title">
          {currentName}
        </p>
      </div>
      {showMergedBadge && <Badge color="info">Fusionné</Badge>}
      {showYearSelector && (
        <div className="structures-year-selector">
          <span className="structures-year-label">Année</span>
          <select
            className="fr-select structures-year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

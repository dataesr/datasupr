import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@dataesr/dsfr-plus";
import i18n from "./i18n.json";
import "./styles.scss";

interface FiltersWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function FiltersWrapper({ children, className = "", style = {} }: FiltersWrapperProps) {
  const [searchParams] = useSearchParams();
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const currentLang = (searchParams.get("language") || searchParams.get("lang") || "fr") as "fr" | "en";

  const getI18nLabel = (key: keyof typeof i18n) => {
    return i18n[key]?.[currentLang] || i18n[key]?.["fr"] || key;
  };

  return (
    <div className={`filters-wrapper ${className}`} style={style}>
      <div className="filters-wrapper__header">
        <Button
          className="filters-wrapper__toggle-button"
          icon="filter-line"
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          size="sm"
          variant="tertiary"
        >
          {getI18nLabel("filters")}
        </Button>
      </div>

      {filtersExpanded && <div className="filters-wrapper__content">{children}</div>}
    </div>
  );
}

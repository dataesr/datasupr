import { useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import "./styles.scss";

const i18n = {
  "range-of-years-label": { fr: "Années", en: "Years" },
  "select-all": { fr: "Tout sélectionner", en: "Select all" },
  "deselect-all": { fr: "Tout désélectionner", en: "Deselect all" },
};

interface RangeOfYearsProps {
  availableYears: string[];
  defaultYears: string[];
}

export default function RangeOfYears({ availableYears, defaultYears }: RangeOfYearsProps) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  const selectedYears = useMemo(() => {
    const param = searchParams.get("range_of_years");
    return param ? param.split("|") : [];
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.get("range_of_years")) {
      searchParams.set("range_of_years", defaultYears.join("|"));
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, defaultYears]);

  if (!pathname) return null;

  function getI18nLabel(key: string) {
    return i18n[key]?.[currentLang] || key;
  }

  function handleYearToggle(year: string) {
    const newSelectedYears = selectedYears.includes(year) ? selectedYears.filter((y) => y !== year) : [...selectedYears, year].sort();

    if (newSelectedYears.length === 0) return;

    searchParams.set("range_of_years", newSelectedYears.join("|"));
    setSearchParams(searchParams);
  }

  function handleSelectAll() {
    searchParams.set("range_of_years", availableYears.join("|"));
    setSearchParams(searchParams);
  }

  function handleDeselectAll() {
    searchParams.set("range_of_years", availableYears[availableYears.length - 1]);
    setSearchParams(searchParams);
  }

  const allSelected = selectedYears.length === availableYears.length;

  return (
    <div className="range-of-years-selector">
      <div className="range-of-years-actions">
        <span className="range-of-years-label">{getI18nLabel("range-of-years-label")}</span>
        <button type="button" className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm" onClick={allSelected ? handleDeselectAll : handleSelectAll}>
          {allSelected ? getI18nLabel("deselect-all") : getI18nLabel("select-all")}
        </button>
      </div>
      <div className="range-of-years-checkboxes">
        {availableYears.map((year) => (
          <div key={year} className="fr-checkbox-group fr-checkbox-group--sm">
            <input type="checkbox" id={`year-${year}`} checked={selectedYears.includes(year)} onChange={() => handleYearToggle(year)} />
            <label className="fr-label" htmlFor={`year-${year}`}>
              {year}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

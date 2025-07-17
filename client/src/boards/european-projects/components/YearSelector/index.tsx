import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import i18n from "./i18n.json";
import { Button } from "@dataesr/dsfr-plus";
import "./styles.scss";

interface YearSelectorProps {
  availableYears: (string | number)[];
  selectedYears: string[];
  onYearsChange: (years: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function YearSelector({ availableYears, selectedYears, onYearsChange, className = "", style = {} }: YearSelectorProps) {
  const [searchParams] = useSearchParams();
  const [tempSelectedYears, setTempSelectedYears] = useState<string[]>(selectedYears);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = (searchParams.get("language") || searchParams.get("lang") || "fr") as "fr" | "en";

  const getI18nLabel = (key: keyof typeof i18n) => {
    return i18n[key]?.[currentLang] || i18n[key]?.["fr"] || key;
  };

  // Synchroniser tempSelectedYears avec selectedYears quand ils changent
  useEffect(() => {
    setTempSelectedYears(selectedYears);
  }, [selectedYears]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleYearToggle = (year: string) => {
    setTempSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
  };

  const handleApplyChanges = () => {
    onYearsChange(tempSelectedYears);
    setIsDropdownOpen(false);
  };

  // const handleCancelChanges = () => {
  //   setTempSelectedYears(selectedYears);
  //   setIsDropdownOpen(false);
  // };

  const handleResetYears = () => {
    const allYears = availableYears.map((year) => year.toString());
    setTempSelectedYears(allYears);
  };

  const getSelectedYearsText = () => {
    if (selectedYears.length === 0) {
      return getI18nLabel("selectYears");
    }

    const totalYears = availableYears.length;

    if (selectedYears.length === 1) {
      return selectedYears[0];
    }

    // Vérifier si les années sont consécutives
    const sortedYears = [...selectedYears].sort((a, b) => parseInt(a) - parseInt(b));
    let isConsecutive = true;
    for (let i = 1; i < sortedYears.length; i++) {
      if (parseInt(sortedYears[i]) !== parseInt(sortedYears[i - 1]) + 1) {
        isConsecutive = false;
        break;
      }
    }

    // Si toutes les années sont sélectionnées ET consécutives, afficher le range complet
    if (selectedYears.length === totalYears && isConsecutive && sortedYears.length > 1) {
      return `${sortedYears[0]}-${sortedYears[sortedYears.length - 1]}`;
    }

    if (isConsecutive && sortedYears.length > 2) {
      return `${sortedYears[0]}-${sortedYears[sortedYears.length - 1]}`;
    } else if (selectedYears.length <= 3) {
      return selectedYears.sort((a, b) => parseInt(a) - parseInt(b)).join(", ");
    } else {
      return `${selectedYears.length} ${getI18nLabel("yearsSelected")}`;
    }
  };

  return (
    <div ref={dropdownRef} className={`year-selector ${className}`} style={style}>
      <Button
        className="year-selector__button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isDropdownOpen) {
            // Synchroniser les années temporaires avec les années actuelles quand on ouvre
            setTempSelectedYears(selectedYears);
          }
          setIsDropdownOpen(!isDropdownOpen);
        }}
        size="sm"
        variant="secondary"
      >
        <span className="year-selector__button-text">{getSelectedYearsText()}</span>
        <span className={`year-selector__arrow ${isDropdownOpen ? "year-selector__arrow--open" : "year-selector__arrow--closed"}`}>▼</span>
      </Button>

      {isDropdownOpen && (
        <div className="year-selector__dropdown" onClick={(e) => e.stopPropagation()}>
          {availableYears.length > 0 ? (
            availableYears.map((year) => (
              <label key={year} className="year-selector__option">
                <input
                  type="checkbox"
                  className="year-selector__checkbox"
                  checked={tempSelectedYears.includes(year.toString())}
                  onChange={() => handleYearToggle(year.toString())}
                />
                {year}
              </label>
            ))
          ) : (
            <div className="year-selector__empty-state">Aucune année disponible</div>
          )}

          <div className="year-selector__actions">
            <Button
              className="year-selector__action-button"
              icon="arrow-go-back-fill"
              onClick={handleResetYears}
              size="sm"
              title={getI18nLabel("reset")}
              variant="tertiary"
            />
            <Button className="year-selector__action-button" onClick={handleApplyChanges} size="sm">
              {getI18nLabel("apply")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

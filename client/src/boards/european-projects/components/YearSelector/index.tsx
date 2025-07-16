import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import i18n from "./i18n.json";

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

  const currentLang = (searchParams.get("lang") || "fr") as "fr" | "en";

  const getI18nLabel = (key: keyof typeof i18n) => {
    return i18n[key][currentLang];
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

  const handleCancelChanges = () => {
    setTempSelectedYears(selectedYears);
    setIsDropdownOpen(false);
  };

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
    <div ref={dropdownRef} className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <button
        className="fr-btn fr-btn--secondary"
        onClick={() => {
          if (!isDropdownOpen) {
            // Synchroniser les années temporaires avec les années actuelles quand on ouvre
            setTempSelectedYears(selectedYears);
          }
          setIsDropdownOpen(!isDropdownOpen);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: "200px",
          textAlign: "left",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <span>{getSelectedYearsText()}</span>
        <span
          style={{
            marginLeft: "8px",
            transition: "transform 0.2s ease-in-out",
            transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>

      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
            animation: "dropdownSlideIn 0.2s ease-out",
            transformOrigin: "top",
          }}
        >
          <style>
            {`
              @keyframes dropdownSlideIn {
                from {
                  opacity: 0;
                  transform: translateY(-10px) scaleY(0.8);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scaleY(1);
                }
              }
            `}
          </style>
          {availableYears.map((year) => (
            <label
              key={year}
              style={{
                display: "block",
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                transition: "background-color 0.15s ease-in-out",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              <input
                type="checkbox"
                checked={tempSelectedYears.includes(year.toString())}
                onChange={() => handleYearToggle(year.toString())}
                style={{ marginRight: "8px" }}
              />
              {year}
            </label>
          ))}

          {/* Boutons de validation */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              padding: "8px 12px",
              borderTop: "1px solid #eee",
              backgroundColor: "#f8f9fa",
            }}
          >
            <button className="fr-btn fr-btn--sm fr-btn--tertiary" onClick={handleResetYears} style={{ flex: 1 }} title={getI18nLabel("reset")}>
              {getI18nLabel("reset")}
            </button>
            <button className="fr-btn fr-btn--sm" onClick={handleApplyChanges} style={{ flex: 1 }}>
              {getI18nLabel("apply")}
            </button>
            <button className="fr-btn fr-btn--sm fr-btn--secondary" onClick={handleCancelChanges} style={{ flex: 1 }}>
              {getI18nLabel("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

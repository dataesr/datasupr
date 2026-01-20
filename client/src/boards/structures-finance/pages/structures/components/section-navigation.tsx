import { useState, useRef, useEffect } from "react";
import TertiaryNavigation, {
  TertiaryNavigationItem,
} from "../../../../../components/tertiary-navigation";

interface SectionNavigationProps {
  activeSection: string;
  years: number[];
  selectedYear: string;
  onSectionChange: (section: string) => void;
  onYearChange: (year: string) => void;
}

export default function SectionNavigation({
  activeSection,
  years,
  selectedYear,
  onSectionChange,
  onYearChange,
}: SectionNavigationProps) {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        borderBottom: "2px solid var(--border-default-grey)",
      }}
    >
      <TertiaryNavigation>
        <TertiaryNavigationItem
          label="Ressources"
          isActive={activeSection === "ressources"}
          onClick={(e) => {
            e.preventDefault();
            onSectionChange("ressources");
          }}
        />
        <TertiaryNavigationItem
          label="Santé financière"
          isActive={activeSection === "sante-financiere"}
          onClick={(e) => {
            e.preventDefault();
            onSectionChange("sante-financiere");
          }}
        />
        <TertiaryNavigationItem
          label="Moyens humains"
          isActive={activeSection === "moyens-humains"}
          onClick={(e) => {
            e.preventDefault();
            onSectionChange("moyens-humains");
          }}
        />
        <TertiaryNavigationItem
          label="Diplômes et formations"
          isActive={activeSection === "diplomes-formations"}
          onClick={(e) => {
            e.preventDefault();
            onSectionChange("diplomes-formations");
          }}
        />
        <TertiaryNavigationItem
          label="Analyses et évolutions"
          isActive={activeSection === "analyses"}
          onClick={(e) => {
            e.preventDefault();
            onSectionChange("analyses");
          }}
        />
      </TertiaryNavigation>

      {years && years.length > 0 && (
        <div
          className="page-header__year-dropdown"
          ref={dropdownRef}
          style={{ marginLeft: "auto" }}
        >
          <button
            className="page-header__year-button"
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            aria-expanded={isYearDropdownOpen}
            aria-haspopup="true"
          >
            <span className="fr-icon-calendar-line" aria-hidden="true" />
            <span className="page-header__year-text">Année {selectedYear}</span>
            <span
              className={`fr-icon-arrow-${
                isYearDropdownOpen ? "up" : "down"
              }-s-line`}
              aria-hidden="true"
            />
          </button>

          {isYearDropdownOpen && (
            <ul className="page-header__year-menu" role="menu">
              {years.map((year) => (
                <li key={year} role="none">
                  <button
                    role="menuitem"
                    className={`page-header__year-option ${
                      selectedYear === year.toString() ? "active" : ""
                    }`}
                    onClick={() => {
                      onYearChange(year.toString());
                      setIsYearDropdownOpen(false);
                    }}
                  >
                    {year}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

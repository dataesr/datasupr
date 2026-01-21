import { useState, useRef, useEffect } from "react";

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
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(
          '.fr-nav__btn[aria-controls="menu-year"]'
        )
      ) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fr-nav" role="navigation" aria-label="Navigation tertiaire">
      <ul className="fr-nav__list">
        <li className="fr-nav__item">
          <a
            className="fr-nav__link"
            href="#ressources"
            aria-current={activeSection === "ressources" ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              onSectionChange("ressources");
            }}
          >
            Ressources
          </a>
        </li>
        <li className="fr-nav__item">
          <a
            className="fr-nav__link"
            href="#sante-financiere"
            aria-current={
              activeSection === "sante-financiere" ? "page" : undefined
            }
            onClick={(e) => {
              e.preventDefault();
              onSectionChange("sante-financiere");
            }}
          >
            Santé financière
          </a>
        </li>
        <li className="fr-nav__item">
          <a
            className="fr-nav__link"
            href="#moyens-humains"
            aria-current={
              activeSection === "moyens-humains" ? "page" : undefined
            }
            onClick={(e) => {
              e.preventDefault();
              onSectionChange("moyens-humains");
            }}
          >
            Moyens humains
          </a>
        </li>
        <li className="fr-nav__item">
          <a
            className="fr-nav__link"
            href="#diplomes-formations"
            aria-current={
              activeSection === "diplomes-formations" ? "page" : undefined
            }
            onClick={(e) => {
              e.preventDefault();
              onSectionChange("diplomes-formations");
            }}
          >
            Diplômes et formations
          </a>
        </li>
        <li className="fr-nav__item">
          <a
            className="fr-nav__link"
            href="#analyses"
            aria-current={activeSection === "analyses" ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              onSectionChange("analyses");
            }}
          >
            Analyses et évolutions
          </a>
        </li>
        <li
          className="fr-nav__item"
          style={{ marginLeft: "auto", position: "relative" }}
        >
          <button
            className="fr-nav__btn"
            type="button"
            aria-expanded={isYearDropdownOpen}
            aria-controls="menu-year"
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
          >
            <span className="fr-icon-calendar-line" aria-hidden="true" />
            Année {selectedYear}
            <span aria-hidden="true" />
          </button>
          <div
            ref={dropdownRef}
            className="fr-collapse fr-menu"
            id="menu-year"
            style={{
              display: isYearDropdownOpen ? "block" : "none",
              position: "absolute",
              top: "100%",
              right: 0,
              zIndex: 1000,
            }}
          >
            <ul className="fr-menu__list">
              {years.map((year) => (
                <li key={year}>
                  <a
                    className="fr-nav__link"
                    href={`#year-${year}`}
                    aria-current={
                      selectedYear === year.toString() ? "page" : undefined
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      onYearChange(year.toString());
                      setIsYearDropdownOpen(false);
                    }}
                  >
                    {year}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  );
}

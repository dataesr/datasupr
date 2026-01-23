import { useState } from "react";
import Dropdown from "../../../../../components/dropdown";

interface SectionNavigationProps {
  activeSection: string;
  years: number[];
  selectedYear: string;
  onSectionChange: (section: string) => void;
  onYearChange: (year: string) => void;
  data?: any;
}

export default function SectionNavigation({
  activeSection,
  years,
  selectedYear,
  onSectionChange,
  onYearChange,
  data,
}: SectionNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const showImplantations = data?.nb_sites > 1;

  const navItems = [
    { id: "ressources", label: "Ressources" },
    { id: "sante-financiere", label: "Santé financière" },
    { id: "moyens-humains", label: "Moyens humains" },
    { id: "diplomes-formations", label: "Diplômes et formations" },
    ...(showImplantations
      ? [{ id: "implantations", label: "Implantations" }]
      : []),
    { id: "analyses", label: "Analyses et évolutions" },
  ];

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setIsOpen(false);
  };

  return (
    <nav
      className="fr-nav"
      id="section-navigation"
      role="navigation"
      aria-label="Navigation secondaire"
      style={{ borderBottom: "1px solid var(--border-default-grey)" }}
    >
      {/* Burger button - visible only on mobile */}
      <button
        className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-menu-fill"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="section-nav-list"
        data-mobile-burger
      >
        Menu
      </button>

      <ul
        id="section-nav-list"
        className="fr-nav__list"
        style={{ alignItems: "center" }}
        data-nav-list
        data-open={isOpen}
      >
        {navItems.map((item) => (
          <li key={item.id} className="fr-nav__item">
            <a
              className="fr-nav__link"
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li
          className="fr-nav__item"
          style={{
            marginLeft: "auto",
            alignSelf: "stretch",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Dropdown
            label={`${selectedYear}`}
            icon="calendar-line"
            align="end"
            variant="nav"
          >
            {years.map((year) => (
              <button
                key={year}
                className={`fx-dropdown__item ${selectedYear === year.toString() ? "fx-dropdown__item--active" : ""}`}
                onClick={() => onYearChange(year.toString())}
              >
                {year}
              </button>
            ))}
          </Dropdown>
        </li>
      </ul>

      <style>{`
        [data-mobile-burger] { display: none; }
        @media (max-width: 61.99em) {
          [data-mobile-burger] { 
            display: flex !important; 
            margin: 0.5rem 1rem;
          }
          [data-nav-list] { 
            display: none !important;
            flex-direction: column;
            background: var(--background-default-grey);
          }
          [data-nav-list][data-open="true"] { display: flex !important; }
          [data-nav-list] .fr-nav__item { width: 100%; }
          [data-nav-list] .fr-nav__link { width: 100%; }
        }
      `}</style>
    </nav>
  );
}

import { useState } from "react";
import Select from "../../../../../components/select";
import "../styles.scss";

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
  const showErc = data?.is_erc === true;

  const navItems = [
    { id: "ressources", label: "Ressources" },
    { id: "sante-financiere", label: "Santé financière" },
    { id: "moyens-humains", label: "Moyens humains" },
    ...(showErc ? [{ id: "erc", label: "ERC" }] : []),
    { id: "diplomes-formations", label: "Diplômes et formations" },
    ...(showImplantations
      ? [{ id: "implantations", label: "Implantations" }]
      : []),
    { id: "positionnement", label: "Positionnement" },
    { id: "analyses", label: "Analyses et évolutions" },
  ];

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setIsOpen(false);
  };

  return (
    <nav
      className="fr-nav section-navigation"
      id="section-navigation"
      role="navigation"
      aria-label="Navigation secondaire"
    >
      <button
        className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-menu-fill section-navigation__burger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="section-nav-list"
      >
        Menu
      </button>

      <ul
        id="section-nav-list"
        className={`fr-nav__list section-navigation__list ${
          isOpen ? "section-navigation__list--open" : ""
        }`}
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
        <li className="fr-nav__item section-navigation__year-item">
          <Select
            label={selectedYear}
            icon="calendar-line"
            align="end"
            outline={false}
            size="sm"
            className="section-navigation__year-select"
            aria-label="Sélectionner une année"
          >
            {years.map((year) => (
              <Select.Option
                key={year}
                value={year.toString()}
                selected={selectedYear === year.toString()}
                onClick={() => onYearChange(year.toString())}
              >
                {year}
              </Select.Option>
            ))}
          </Select>
        </li>
      </ul>
    </nav>
  );
}

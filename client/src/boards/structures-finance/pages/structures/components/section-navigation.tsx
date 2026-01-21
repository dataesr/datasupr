import Dropdown from "../../../../../components/dropdown";

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
  return (
    <nav
      className="fr-nav"
      id="section-navigation"
      role="navigation"
      aria-label="Navigation secondaire"
      style={{ borderBottom: "1px solid var(--border-default-grey)" }}
    >
      <ul className="fr-nav__list" style={{ alignItems: "center" }}>
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
    </nav>
  );
}

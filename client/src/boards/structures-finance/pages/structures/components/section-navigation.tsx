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
  const showImplantations = data?.nb_sites > 1;
  
  return (
    <div className="fr-header" style={{ borderBottom: "1px solid var(--border-default-grey)" }}>
      <div className="fr-container">
        <div className="fr-header__body-row">
          <div className="fr-header__navbar">
            <button
              data-fr-opened="false"
              aria-controls="modal-section-nav"
              title="Menu des sections"
              type="button"
              id="button-section-nav"
              className="fr-btn--menu fr-btn"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
      <div
        className="fr-header__menu fr-modal"
        id="modal-section-nav"
        aria-labelledby="button-section-nav"
      >
        <div className="fr-container">
          <button
            aria-controls="modal-section-nav"
            title="Fermer"
            type="button"
            className="fr-btn--close fr-btn"
          >
            Fermer
          </button>
          <nav
            className="fr-nav"
            role="navigation"
            aria-label="Navigation secondaire"
          >
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
                  aria-current={activeSection === "sante-financiere" ? "page" : undefined}
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
                  aria-current={activeSection === "moyens-humains" ? "page" : undefined}
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
                  aria-current={activeSection === "diplomes-formations" ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onSectionChange("diplomes-formations");
                  }}
                >
                  Diplômes et formations
                </a>
              </li>
              {showImplantations && (
                <li className="fr-nav__item">
                  <a
                    className="fr-nav__link"
                    href="#implantations"
                    aria-current={activeSection === "implantations" ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onSectionChange("implantations");
                    }}
                  >
                    Implantations
                  </a>
                </li>
              )}
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
              <li className="fr-nav__item">
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
        </div>
      </div>
    </div>
  );
}

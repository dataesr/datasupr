import { Badge, Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import TertiaryNavigation, {
  TertiaryNavigationItem,
} from "../../../../../../components/tertiary-navigation";

interface PageHeaderProps {
  data: any;
  onClose: () => void;
  years?: number[];
  selectedYear?: string;
}

export default function PageHeader({
  data,
  onClose,
  years = [],
  selectedYear,
}: PageHeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || "ressources";
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [showFormations, setShowFormations] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSectionChange = (section: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", section);
    setSearchParams(next);
  };

  const handleYearChange = (year: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("year", year);
    setSearchParams(next);
    setIsYearDropdownOpen(false);
  };

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

  if (!data) return null;

  const hasCursus =
    data.has_effectif_l || data.has_effectif_m || data.has_effectif_d;
  const hasFilieres =
    data.has_effectif_iut || data.has_effectif_sante || data.has_effectif_ing;
  const hasDisciplines =
    data.has_effectif_dsa ||
    data.has_effectif_llsh ||
    data.has_effectif_theo ||
    data.has_effectif_si ||
    data.has_effectif_staps ||
    data.has_effectif_veto ||
    data.has_effectif_sante ||
    data.has_effectif_interd;

  const hasFormations = hasCursus || hasFilieres || hasDisciplines;

  const showActuelName =
    data.etablissement_actuel_lib &&
    data.etablissement_lib &&
    data.etablissement_lib !== data.etablissement_actuel_lib;

  const headerContent = (
    <div className="fr-py-3w">
      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-mb-2w">
        <div className="fr-col">
          <h1 className="fr-h3 fr-mb-0">
            {data.etablissement_lib || data.etablissement_actuel_lib}
          </h1>
          {showActuelName && (
            <p className="fr-text--sm fr-text--bold fr-mb-0 fr-mt-1v">
              {data.etablissement_actuel_lib}
            </p>
          )}
        </div>
        <div className="fr-col-auto">
          <button
            className="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-arrow-go-back-line"
            onClick={onClose}
            title="Changer d'établissement"
          >
            Changer
          </button>
        </div>
      </div>

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-mb-2w">
            {data.etablissement_actuel_categorie && (
              <p className="fr-text--sm fr-text-mention--grey">
                {data.etablissement_actuel_categorie}
              </p>
            )}
            <p className="fr-text--sm fr-text-mention--grey">
              <span
                className="fr-icon-map-pin-2-line fr-icon--sm"
                aria-hidden="true"
              />{" "}
              {data.commune} — {data.region}
              {data.nb_sites && (
                <>
                  {" "}
                  • {data.nb_sites} {data.nb_sites > 1 ? "sites" : "site"}
                </>
              )}
            </p>
          </div>

          {data.is_rce && (
            <p className="fr-text--sm fr-text-mention--grey">
              <span aria-hidden="true" />
              Responsabilités et compétences élargies (RCE)
              {data.rce && <> depuis {data.rce}</>}
            </p>
          )}
        </div>

        <div className="fr-col-12 fr-col-md-6" style={{ textAlign: "right" }}>
          {data.effectif_sans_cpge && (
            <div className="fr-mb-2w">
              <p className="fr-text--lg fr-text--bold fr-mb-0">
                {data.effectif_sans_cpge.toLocaleString("fr-FR")} étudiants
              </p>
              <p className="fr-text--xs fr-mb-0">
                Inscrits en {data.anuniv} (
                {data.part_effectif_sans_cpge_dn.toFixed(1)}% en diplômes
                nationaux)
              </p>
            </div>
          )}

          {hasFormations && (
            <div style={{ textAlign: "right" }}>
              <button
                className="fr-btn fr-btn--tertiary fr-btn--sm fr-btn--icon-right"
                onClick={() => setShowFormations(!showFormations)}
                aria-expanded={showFormations}
              >
                <span
                  className={`fr-icon-${
                    showFormations ? "arrow-up" : "arrow-down"
                  }-s-line`}
                  aria-hidden="true"
                />
                {showFormations ? "Masquer" : "Afficher"} les formations
                proposées
              </button>

              {showFormations && (
                <div className="fr-mt-2v">
                  {hasCursus && (
                    <div className="fr-mb-2v">
                      <p
                        className="fr-text--xs fr-text--bold fr-mb-1v"
                        style={{
                          textTransform: "uppercase",
                          color: "var(--text-mention-grey)",
                        }}
                      >
                        Cursus
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.375rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        {data.has_effectif_l && (
                          <Badge color="blue-cumulus" size="sm">
                            1er cycle L
                          </Badge>
                        )}
                        {data.has_effectif_m && (
                          <Badge color="green-archipel" size="sm">
                            2ème cycle M
                          </Badge>
                        )}
                        {data.has_effectif_d && (
                          <Badge color="pink-tuile" size="sm">
                            3ème cycle D
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {hasFilieres && (
                    <div className="fr-mb-2v">
                      <p
                        className="fr-text--xs fr-text--bold fr-mb-1v"
                        style={{
                          textTransform: "uppercase",
                          color: "var(--text-mention-grey)",
                        }}
                      >
                        Filières spécifiques
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.375rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        {data.has_effectif_iut && (
                          <Badge color="blue-cumulus" size="sm">
                            IUT
                          </Badge>
                        )}
                        {data.has_effectif_sante && (
                          <Badge color="brown-caramel" size="sm">
                            Santé
                          </Badge>
                        )}
                        {data.has_effectif_ing && (
                          <Badge color="yellow-tournesol" size="sm">
                            Ingénieur
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {hasDisciplines && (
                    <div className="fr-mb-0">
                      <p
                        className="fr-text--xs fr-text--bold fr-mb-1v"
                        style={{
                          textTransform: "uppercase",
                          color: "var(--text-mention-grey)",
                        }}
                      >
                        Disciplines
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.375rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        {data.has_effectif_dsa && (
                          <Badge color="green-emeraude" size="sm">
                            Droit Sciences Éco AES
                          </Badge>
                        )}
                        {data.has_effectif_llsh && (
                          <Badge color="pink-tuile" size="sm">
                            Lettres Langues SHS
                          </Badge>
                        )}
                        {data.has_effectif_theo && (
                          <Badge color="purple-glycine" size="sm">
                            Théologie
                          </Badge>
                        )}
                        {data.has_effectif_si && (
                          <Badge color="orange-terre-battue" size="sm">
                            Sciences et ingénieur
                          </Badge>
                        )}
                        {data.has_effectif_staps && (
                          <Badge color="green-menthe" size="sm">
                            STAPS
                          </Badge>
                        )}
                        {data.has_effectif_veto && (
                          <Badge color="green-archipel" size="sm">
                            Vétérinaire
                          </Badge>
                        )}
                        {data.has_effectif_interd && (
                          <Badge color="pink-macaron" size="sm">
                            Interdisciplinaire
                          </Badge>
                        )}
                        {data.has_effectif_sante && (
                          <Badge color="brown-caramel" size="sm">
                            Santé
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const navigationContent = (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <TertiaryNavigation>
        <TertiaryNavigationItem
          label="Ressources"
          isActive={activeSection === "ressources"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("ressources");
          }}
        />
        <TertiaryNavigationItem
          label="Santé financière"
          isActive={activeSection === "sante-financiere"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("sante-financiere");
          }}
        />
        <TertiaryNavigationItem
          label="Moyens humains"
          isActive={activeSection === "moyens-humains"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("moyens-humains");
          }}
        />
        <TertiaryNavigationItem
          label="Diplômes et formations"
          isActive={activeSection === "diplomes-formations"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("diplomes-formations");
          }}
        />
        <TertiaryNavigationItem
          label="Analyses et évolutions"
          isActive={activeSection === "analyses"}
          onClick={(e) => {
            e.preventDefault();
            handleSectionChange("analyses");
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
                    onClick={() => handleYearChange(year.toString())}
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

  return (
    <>
      <Container fluid className="etablissement-selector__wrapper">
        <Container>{headerContent}</Container>
      </Container>
      <Container>{navigationContent}</Container>
    </>
  );
}

import { useSearchParams } from "react-router-dom";

export default function SectionNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || "produits-vs-etudiants";

  const handleSectionChange = (section: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", section);
    setSearchParams(next);
  };

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
            href="#produits-vs-etudiants"
            aria-current={
              activeSection === "produits-vs-etudiants" ? "page" : undefined
            }
            onClick={(e) => {
              e.preventDefault();
              handleSectionChange("produits-vs-etudiants");
            }}
          >
            Produits vs Effectifs
          </a>
        </li>
        <li className="fr-nav__item">
          <a
            className="fr-nav__link"
            href="#scsp-vs-encadrement"
            aria-current={
              activeSection === "scsp-vs-encadrement" ? "page" : undefined
            }
            onClick={(e) => {
              e.preventDefault();
              handleSectionChange("scsp-vs-encadrement");
            }}
          >
            SCSP vs Encadrement
          </a>
        </li>
        <li className="fr-nav__item">
          <a
            className="fr-nav__link"
            href="#scsp-vs-ressources-propres"
            aria-current={
              activeSection === "scsp-vs-ressources-propres"
                ? "page"
                : undefined
            }
            onClick={(e) => {
              e.preventDefault();
              handleSectionChange("scsp-vs-ressources-propres");
            }}
          >
            SCSP vs Ressources propres
          </a>
        </li>
        <li className="fr-nav__item">
          <a
            className="fr-nav__link"
            href="#comparison"
            aria-current={activeSection === "comparison" ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              handleSectionChange("comparison");
            }}
          >
            Comparaison de métriques
          </a>
        </li>
      </ul>
    </nav>
  );
}

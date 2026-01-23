import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const SECTION_LABELS: Record<string, string> = {
  "produits-vs-etudiants": "Produits vs Effectifs",
  "scsp-vs-encadrement": "SCSP vs Encadrement",
  "scsp-vs-ressources-propres": "SCSP vs Ressources propres",
  comparison: "Comparaison de métriques",
};

export default function NationalBreadcrumb() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const section = searchParams.get("section");

  const currentSectionLabel = section && SECTION_LABELS[section];

  const handleVueNationaleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    next.delete("section");
    setSearchParams(next);
  };

  return (
    <nav
      role="navigation"
      className="fr-breadcrumb"
      aria-label="vous êtes ici :"
    >
      <button
        type="button"
        className="fr-breadcrumb__button"
        aria-expanded={isExpanded}
        aria-controls="national-breadcrumb"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Voir le fil d'Ariane
      </button>
      <div
        className={`fr-collapse${isExpanded ? " fr-collapse--expanded" : ""}`}
        id="national-breadcrumb"
      >
        <ol className="fr-breadcrumb__list">
          <li>
            <Link
              className="fr-breadcrumb__link"
              to="/structures-finance/accueil"
            >
              Accueil
            </Link>
          </li>
          {currentSectionLabel ? (
            <>
              <li>
                <a
                  className="fr-breadcrumb__link"
                  href="/structures-finance/national"
                  onClick={handleVueNationaleClick}
                >
                  Vue nationale
                </a>
              </li>
              <li>
                <a className="fr-breadcrumb__link" aria-current="page">
                  {currentSectionLabel}
                </a>
              </li>
            </>
          ) : (
            <li>
              <a className="fr-breadcrumb__link" aria-current="page">
                Vue nationale
              </a>
            </li>
          )}
        </ol>
      </div>
    </nav>
  );
}

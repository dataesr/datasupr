import { useState } from "react";
import { Link } from "react-router-dom";

interface SimpleBreadcrumbProps {
  currentPageLabel: string;
}

export default function SimpleBreadcrumb({
  currentPageLabel,
}: SimpleBreadcrumbProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
        aria-controls="simple-breadcrumb"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Voir le fil d'Ariane
      </button>
      <div
        className={`fr-collapse${isExpanded ? " fr-collapse--expanded" : ""}`}
        id="simple-breadcrumb"
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
          <li>
            <a className="fr-breadcrumb__link" aria-current="page">
              {currentPageLabel}
            </a>
          </li>
        </ol>
      </div>
    </nav>
  );
}

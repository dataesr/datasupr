import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface StructuresBreadcrumbProps {
  etablissementLib?: string;
  sectionLabel?: string;
}

const SECTION_LABELS: Record<string, string> = {
  ressources: "Ressources",
  "sante-financiere": "Santé financière",
  "moyens-humains": "Moyens humains",
  "diplomes-formations": "Diplômes et formations",
  implantations: "Implantations",
  analyses: "Analyses et évolutions",
};

export default function StructuresBreadcrumb({
  etablissementLib,
  sectionLabel,
}: StructuresBreadcrumbProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");

  const currentSectionLabel =
    sectionLabel || (section && SECTION_LABELS[section]);

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
        aria-controls="structures-breadcrumb"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Voir le fil d'Ariane
      </button>
      <div
        className={`fr-collapse${isExpanded ? " fr-collapse--expanded" : ""}`}
        id="structures-breadcrumb"
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
          {etablissementLib ? (
            <>
              <li>
                <Link
                  className="fr-breadcrumb__link"
                  to="/structures-finance/etablissements"
                >
                  {etablissementLib}
                </Link>
              </li>
              {currentSectionLabel && (
                <li>
                  <a className="fr-breadcrumb__link" aria-current="page">
                    {currentSectionLabel}
                  </a>
                </li>
              )}
            </>
          ) : (
            <li>
              <a className="fr-breadcrumb__link" aria-current="page">
                Sélectionner un établissement
              </a>
            </li>
          )}
        </ol>
      </div>
    </nav>
  );
}

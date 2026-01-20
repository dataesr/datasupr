import { useSearchParams, useLocation } from "react-router-dom";
import { Link } from "@dataesr/dsfr-plus";

export default function CustomBreadcrumb({ config }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentLang = searchParams.get("language") || "fr";
  const section = searchParams.get("section") || null;
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join("&");
  const isDatasupr = searchParams.get("datasupr") || "false";

  // Extraire la dernière partie de l'URL comme currentPage
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1] || "";
  const parent = pathSegments[pathSegments.length - 2] || "";

  return (
    <nav role="navigation" className="fr-breadcrumb" aria-label="vous êtes ici :">
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">
        Voir le fil d’Ariane
      </button>
      <div className="fr-collapse" id="breadcrumb-1">
        <ol className="fr-breadcrumb__list">
          {isDatasupr === "true" && (
            <li>
              <Link href={`${config[parent].link}?${params}`}>{currentLang === "fr" ? "Sélectionner un tableau de bord" : "Select a dashboard"}</Link>
            </li>
          )}
          <li>
            <Link href={`${config[parent].link}?${params}`}>{config[parent].label[currentLang]}</Link>
          </li>
          {section ? (
            <>
              <li>
                <Link href={`${config[currentPage].link}?${params}`}>{config[currentPage].label[currentLang]}</Link>
              </li>
              <li>
                <Link>
                  <strong>{config[section].label[currentLang]}</strong>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link>
                <strong>{config[currentPage].label[currentLang]}</strong>
              </Link>
            </li>
          )}
        </ol>
      </div>
    </nav>
  );
}

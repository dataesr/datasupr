import { NavLink } from "react-router-dom";
import "./breadcrumb.scss";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav
      role="navigation"
      className="fr-breadcrumb"
      aria-label="vous êtes ici :"
    >
      <button
        className="fr-breadcrumb__button"
        aria-expanded="false"
        aria-controls="breadcrumb-1"
      >
        Voir le fil d'Ariane
      </button>
      <div className="fr-collapse" id="breadcrumb-1">
        <ol className="fr-breadcrumb__list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.path}>
                {isLast ? (
                  <a className="fr-breadcrumb__link" aria-current="page">
                    {item.label}
                  </a>
                ) : (
                  <NavLink className="fr-breadcrumb__link" to={item.path}>
                    {item.label}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

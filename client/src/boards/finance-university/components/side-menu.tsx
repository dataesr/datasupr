import { useLocation } from "react-router-dom";
import "./styles.scss";

export default function Layout() {
  const { pathname } = useLocation();

  if (!pathname) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fr-sidemenu" aria-labelledby="fr-sidemenu-title">
      <div className="fr-sidemenu__inner">
        <div className="fr-collapse">
          <ul className="fr-sidemenu__list">
            <li
              className={`fr-sidemenu__item ${
                isActive("/finance-universite/accueil")
                  ? "fr-sidemenu__item--active"
                  : ""
              }`}
            >
              <a
                className="fr-sidemenu__link"
                href="/finance-universite/accueil"
                aria-current={
                  isActive("/finance-universite/accueil") ? "page" : undefined
                }
              >
                Accueil
              </a>
            </li>
            <li
              className={`fr-sidemenu__item ${
                isActive("/finance-universite/etablissements")
                  ? "fr-sidemenu__item--active"
                  : ""
              }`}
            >
              <a
                className="fr-sidemenu__link"
                href="/finance-universite/etablissements"
                aria-current={
                  isActive("/finance-universite/etablissements")
                    ? "page"
                    : undefined
                }
              >
                Etablissement
              </a>
            </li>
            <li
              className={`fr-sidemenu__item ${
                isActive("/finance-universite/vue-nationale")
                  ? "fr-sidemenu__item--active"
                  : ""
              }`}
            >
              <a
                className="fr-sidemenu__link"
                href="/finance-universite/vue-nationale"
                aria-current={
                  isActive("/finance-universite/vue-nationale")
                    ? "page"
                    : undefined
                }
              >
                Vue nationale
              </a>
            </li>
            <li
              className={`fr-sidemenu__item ${
                isActive("/finance-universite/evolutions")
                  ? "fr-sidemenu__item--active"
                  : ""
              }`}
            >
              <a
                className="fr-sidemenu__link"
                href="/finance-universite/evolutions"
                aria-current={
                  isActive("/finance-universite/evolutions")
                    ? "page"
                    : undefined
                }
              >
                Evolutions
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

import "./styles.scss";
import { useLocation } from "react-router-dom";

export default function CustomSideMenu() {
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
                isActive("/structures-finance/accueil")
                  ? "fr-sidemenu__item--active"
                  : ""
              }`}
            >
              <a
                className="fr-sidemenu__link"
                href="/structures-finance/accueil"
                aria-current={
                  isActive("/structures-finance/accueil") ? "page" : undefined
                }
              >
                Accueil
              </a>
            </li>
            <li
              className={`fr-sidemenu__item ${
                isActive("/structures-finance/etablissements")
                  ? "fr-sidemenu__item--active"
                  : ""
              }`}
            >
              <a
                className="fr-sidemenu__link"
                href="/structures-finance/etablissements"
                aria-current={
                  isActive("/structures-finance/etablissements")
                    ? "page"
                    : undefined
                }
              >
                Etablissement
              </a>
            </li>
            <li
              className={`fr-sidemenu__item ${
                isActive("/structures-finance/national")
                  ? "fr-sidemenu__item--active"
                  : ""
              }`}
            >
              <a
                className="fr-sidemenu__link"
                href="/structures-finance/national"
                aria-current={
                  isActive("/structures-finance/national") ? "page" : undefined
                }
              >
                Vue nationale
              </a>
            </li>
            {/* <li
              className={`fr-sidemenu__item ${
                isActive("/structures-finance/evolutions")
                  ? "fr-sidemenu__item--active"
                  : ""
              }`}
            >
              <a
                className="fr-sidemenu__link"
                href="/structures-finance/evolutions"
                aria-current={
                  isActive("/structures-finance/evolutions")
                    ? "page"
                    : undefined
                }
              >
                Evolutions
              </a>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

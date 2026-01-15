import {
  Outlet,
  useLocation,
  useSearchParams,
  NavLink,
} from "react-router-dom";

import Footer from "./footer";
import SwitchTheme from "../../../../components/switch-theme";
import i18n from "./i18n.json";

export default function GlobalLayout() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  if (!pathname) return null;

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <>
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <p className="fr-logo">
                      Ministère
                      <br />
                      de l'Enseignement
                      <br />
                      supérieur,
                      <br />
                      de la Recherche
                      <br />
                      et de l'Espace
                    </p>
                  </div>
                  <div className="fr-header__operator">
                    <img
                      className="fr-responsive-img"
                      style={{ width: "3.5rem" }}
                      src="/logo.svg"
                      alt=""
                    />
                  </div>
                  <div className="fr-header__navbar">
                    <button
                      className="fr-btn--menu fr-btn"
                      data-fr-opened="false"
                      aria-controls="modal-832"
                      aria-haspopup="menu"
                      id="fr-btn-menu-mobile"
                      title="Menu"
                    >
                      Menu
                    </button>
                  </div>
                </div>
                <div className="fr-header__service">
                  <a href="/" title="Accueil - DataSupR">
                    <p className="fr-header__service-title">#dataESR</p>
                  </a>
                  <p className="fr-header__service-tagline">
                    {getI18nLabel("title")}
                  </p>
                </div>
              </div>
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  <ul className="fr-btns-group">
                    <li>
                      <button
                        className="fr-btn fr-icon-theme-fill"
                        aria-controls="fr-theme-modal"
                        data-fr-opened="false"
                        title="Changer le thème d'affichage"
                      >
                        <span className="fr-hidden fr-unhidden-sm">
                          {getI18nLabel("themes")}
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="fr-header__menu fr-modal"
          id="modal-832"
          aria-labelledby="fr-btn-menu-mobile"
        >
          <div className="fr-container">
            <button
              className="fr-btn--close fr-btn"
              aria-controls="modal-832"
              title="Fermer"
            >
              Fermer
            </button>
            <div className="fr-header__menu-links"></div>
            <nav
              className="fr-nav"
              id="navigation-832"
              role="navigation"
              aria-label="Menu principal"
            >
              <ul className="fr-nav__list">
                <li className="fr-nav__item">
                  <NavLink
                    className="fr-nav__link"
                    aria-current={
                      pathname === "/structures-finance/accueil"
                        ? "page"
                        : undefined
                    }
                    to="/structures-finance/accueil"
                  >
                    Accueil
                  </NavLink>
                </li>
                <li className="fr-nav__item">
                  <NavLink
                    className="fr-nav__link"
                    aria-current={
                      pathname === "/structures-finance/etablissements"
                        ? "page"
                        : undefined
                    }
                    to="/structures-finance/etablissements"
                  >
                    Etablissements
                  </NavLink>
                </li>
                <li className="fr-nav__item">
                  <NavLink
                    className="fr-nav__link"
                    aria-current={
                      pathname === "/structures-finance/national"
                        ? "page"
                        : undefined
                    }
                    to="/structures-finance/national"
                  >
                    Vue nationale
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <Outlet />
      <Footer />
      <SwitchTheme />
    </>
  );
}

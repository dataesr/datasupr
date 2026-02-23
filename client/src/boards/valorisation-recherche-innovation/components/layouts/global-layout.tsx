import { Logo, Service } from "@dataesr/dsfr-plus";
import { Link, Outlet, useLocation } from "react-router-dom";

import Footer from "../../../../components/footer";
import { getI18nLabel } from "../../../../utils";
import i18n from "./i18n.json";

import "./styles.scss";

export default function GlobalLayout() {
  const { pathname } = useLocation();

  if (!pathname) return null;
  const is = (str: string): boolean => pathname?.startsWith(str);

  return (
    <>
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <Logo text={import.meta.env.VITE_MINISTER_NAME} />
                  <Service
                    href="/valorisation-recherche-innovation/accueil"
                    name="Valorisation de la recherche - innovation"
                    tagline=""
                  />
                  <div className="fr-header__navbar">
                    <button
                      data-fr-opened="false"
                      aria-controls="modal-header"
                      title="Menu"
                      type="button"
                      id="button-header"
                      className="fr-btn--menu fr-btn"
                    >
                      Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-header__menu fr-modal" id="modal-header" aria-labelledby="button-header">
          <div className="fr-container">
            <button aria-controls="modal-header" title="Fermer" type="button" id="button-2168" className="fr-btn--close fr-btn">
              {getI18nLabel(i18n, "close")}
            </button>
            <div className="fr-header__menu-links"></div>
            <nav className="fr-nav" role="navigation" aria-label="Menu principal">
              <ul className="fr-nav__list">
                <li className="fr-nav__item">
                  <Link
                    {...(pathname === "/valorisation-recherche-innovation/accueil" && { "aria-current": "page" })}
                    className="fr-nav__link"
                    target="_self"
                    to="/valorisation-recherche-innovation/accueil"
                  >
                    <span className="fr-icon-home-4-line fr-mr-1w" aria-hidden="true" />
                    {getI18nLabel(i18n, "accueil")}
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    {...(is("/valorisation-recherche-innovation/etablissement") && { "aria-current": "page" })}
                    className="fr-nav__link"
                    target="_self"
                    to={`/valorisation-recherche-innovation/etablissement`}
                  >
                    {getI18nLabel(i18n, "etablissement")}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <Outlet />
      <Footer
        href="/valorisation-recherche-innovation/accueil"
        title="Valorisation de la recherche - innovation - Tableaux"
      />
    </>
  );
}

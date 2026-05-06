import { Logo, Service } from "@dataesr/dsfr-plus";
import { Link, Outlet, useLocation } from "react-router-dom";

import Footer from "../../../../components/footer";
import { getI18nLabel } from "../../../../utils";
import i18n from "./i18n.json";

import "./styles.scss"

import "../../colors.scss";


const NAV_ITEMS = [
  { key: "flux", labelKey: "flux", to: "/devenir-etudiants/flux" },
  { key: "repartition", labelKey: "repartition", to: "/devenir-etudiants/repartition" },
  { key: "plus-haut-diplome", labelKey: "plusHautDiplome", to: "/devenir-etudiants/plus-haut-diplome" },
  { key: "croisements", labelKey: "croisements", to: "/devenir-etudiants/croisements" },
  { key: "comparaison-profils", labelKey: "comparaisonProfils", to: "/devenir-etudiants/comparaison-profils" },
  { key: "methodologie", labelKey: "methodologie", to: "/devenir-etudiants/methodologie" },
] as const;

export default function GlobalLayout() {
  const { pathname, search } = useLocation();

  if (!pathname) return null;

  return (
    <>
      <header className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <Logo text={import.meta.env.VITE_MINISTER_NAME} />
                  <Service
                    href="/"
                    name="#dataESR tableaux de bord"
                    tagline={getI18nLabel(i18n, "tagline")}
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
            <button
              aria-controls="modal-header"
              title="Fermer"
              type="button"
              id="button-close-header"
              className="fr-btn--close fr-btn"
            >
              {getI18nLabel(i18n, "close")}
            </button>
            <div className="fr-header__menu-links"></div>
            <nav className="fr-nav" aria-label="Menu principal">
              <ul className="fr-nav__list">
                {NAV_ITEMS.map(({ key, labelKey, to }) => (
                  <li key={key} className="fr-nav__item">
                    <Link
                      to={`${to}${search}`}
                      target="_self"
                      {...(pathname === to && { "aria-current": "page" })}
                      className="fr-nav__link"
                    >
                      {getI18nLabel(i18n, labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <Outlet />
      <Footer href="/devenir-etudiants/flux" title="#dataESR tableaux de bord" />
    </>
  );
}

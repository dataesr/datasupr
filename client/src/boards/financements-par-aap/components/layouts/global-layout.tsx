import { Logo, Service } from "@dataesr/dsfr-plus";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";

import { years } from "../../utils";
import Footer from "./footer";
import i18n from "./i18n.json";

const { VITE_MINISTER_NAME } = import.meta.env;


export default function GlobalLayout() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  useEffect(() => {
    if (!searchParams.get("yearMax") || !searchParams.get("yearMin")) {
      if (!searchParams.get("yearMax")) {
        searchParams.set("yearMax", String(years[years.length - 2]));
      }
      if (!searchParams.get("yearMin")) {
        searchParams.set("yearMin", String(years[years.length - 2]));
      }
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  if (!pathname) return null;
  const is = (str: string): boolean => pathname?.startsWith(str);

  function getI18nLabel(key) {
    try {
      return i18n[key][currentLang];
    } catch (error) {
      console.error(`No translation key ${key}`);
      return key;
    }
  }

  return (
    <>
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <Logo splitCharacter="<br>" text={VITE_MINISTER_NAME} />
                  <Service
                    href="/financements-par-aap/accueil"
                    name="Financements par appel à projet"
                    tagline="Suivi des financements par appel à projet dans les institutions françaises"
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
              {getI18nLabel("close")}
            </button>
            <div className="fr-header__menu-links"></div>
            <nav className="fr-nav" role="navigation" aria-label="Menu principal">
              <ul className="fr-nav__list">
                <li className="fr-nav__item">
                  <Link
                    to="/financements-par-aap/home"
                    target="_self"
                    {...(pathname === "/financements-par-aap/home" && { "aria-current": "page" })}
                    className="fr-nav__link"
                  >
                    <span className="fr-icon-home-4-line fr-mr-1w" aria-hidden="true" />
                    {getI18nLabel("home")}
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/financements-par-aap/structures?${searchParams}`}
                    target="_self"
                    {...(is("/financements-par-aap/structures") && { "aria-current": "page" })}
                    className="fr-nav__link"
                  >
                    {getI18nLabel("structures")}
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/financements-par-aap/comparison?${searchParams}`}
                    target="_self"
                    {...(is("/financements-par-aap/comparison") && { "aria-current": "page" })}
                    className="fr-nav__link"
                  >
                    {getI18nLabel("comparison")}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <Outlet />
      <Footer />
    </>
  );
}

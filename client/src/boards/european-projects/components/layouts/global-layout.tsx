import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";

import Breadcrumb from "../../../../components/breadcrumb";
import CountrySelector from "../../../../components/country-selector/selector";
import Footer from "../../../../components/footer";
import i18n from "./i18n.json";
import navigationConfig from "./navigation-config.json";

import "../styles.scss";


export default function GlobalLayout() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const filtersParams = searchParams.toString();

  useEffect(() => {
    if (!searchParams.get("language")) {
      searchParams.set("language", "fr"); // default value
      setSearchParams(searchParams);
    }
    if (!searchParams.get("country_code")) {
      searchParams.set("country_code", "FRA"); // default value
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  if (!pathname) return null;
  const is = (str: string): boolean => pathname?.startsWith(str);

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
                    <a href="/" title="Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)">
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
                    </a>
                  </div>
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
                    to="/european-projects/accueil"
                    target="_self"
                    {...(pathname === "/european-projects/accueil" && { "aria-current": "page" })}
                    className="fr-nav__link"
                  >
                    <span className="fr-icon-home-4-line fr-mr-1w" aria-hidden="true" />
                    {getI18nLabel("home")}
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/european-projects/horizon-europe?${filtersParams}`}
                    target="_self"
                    {...(is("/european-projects/horizon-europe") && { "aria-current": "page" })}
                    className="fr-nav__link"
                  >
                    {getI18nLabel("he")}
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/european-projects/msca?${filtersParams}`}
                    target="_self"
                    {...(is("/european-projects/msca") && { "aria-current": "page" })}
                    className="fr-nav__link"
                  >
                    MSCA
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/european-projects/erc?${filtersParams}`}
                    target="_self"
                    {...(is("/european-projects/erc") && { "aria-current": "page" })}
                    className="fr-nav__link"
                  >
                    ERC
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to="/european-projects/evolution-pcri"
                    target="_self"
                    {...(is("/european-projects/evolution-pcri") && { "aria-current": "page" })}
                    className="fr-nav__link"
                  >
                    {getI18nLabel("evolutionPcri")}
                  </Link>
                </li>
                <li style={{ marginLeft: "auto" }}>
                  <CountrySelector />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <Container>
        <Row>
          <Col>
            <Breadcrumb config={navigationConfig} />
          </Col>
        </Row>
      </Container>
      <Outlet />
      <Footer />
    </>
  );
}
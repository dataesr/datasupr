import { Button, Container, FastAccess, Header, Link, Logo, Nav, Service } from "@dataesr/dsfr-plus";
import { useState } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";

import SwitchTheme from "../../../../components/switch-theme";
import Footer from "./footer";
import i18n from "./i18n.json";
import "../styles.scss";

export default function GlobalLayout({ languageSelector = false }) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [menuOpen, setMenuOpen] = useState(false);

  if (!pathname) return null;
  const is = (str: string): boolean => pathname?.startsWith(str);

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <>
      <Header>
        <Logo text="Ministère|de l'Enseignement|supérieur,|de la Recherche|et de l'Espace" />
        <Service name="DataSupR" tagline={getI18nLabel("tagline")} />
        <FastAccess>
          <Button as="a" href="/" icon="github-fill" size="sm" variant="text">
            {getI18nLabel("explore")}
          </Button>
          <Button
            as="a"
            href="https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-atlas_regional-effectifs-d-etudiants-inscrits/table/?disjunctive.rgp_formations_ou_etablissements&sort=-rentree"
            icon="code-s-slash-line"
            rel="noreferer noopener"
            size="sm"
            target="_blank"
            variant="text"
          >
            {getI18nLabel("datasets")}
          </Button>
          <Button aria-controls="fr-theme-modal" className="fr-btn fr-icon-theme-fill" data-fr-opened="false">
            {getI18nLabel("themes")}
          </Button>
          {languageSelector && (
            <nav role="navigation" className="fr-translate fr-nav">
              <div className="fr-nav__item">
                <button
                  aria-controls="translate-1177"
                  aria-expanded="false"
                  className="fr-translate__btn fr-btn fr-btn--tertiary"
                  title={getI18nLabel("languagesSelector")}
                >
                  {currentLang === "fr" ? (
                    <>
                      FR<span className="fr-hidden-lg"> - Français</span>
                    </>
                  ) : (
                    <>
                      EN<span className="fr-hidden-lg"> - English</span>
                    </>
                  )}
                </button>
                <div className="fr-collapse fr-translate__menu fr-menu" id="translate-1177">
                  <ul className="fr-menu__list">
                    <li>
                      <Button
                        aria-current={searchParams.get("language") === "fr"}
                        className="fr-translate__language fr-nav__link"
                        onClick={() => {
                          searchParams.set("language", "fr");
                          setSearchParams(searchParams);
                        }}
                      >
                        FR - Français
                      </Button>
                    </li>
                    <li>
                      <Button
                        aria-current={searchParams.get("language") === "en"}
                        className="fr-translate__language fr-nav__link"
                        onClick={() => {
                          searchParams.set("language", "en");
                          setSearchParams(searchParams);
                        }}
                      >
                        EN - English
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          )}
        </FastAccess>
      </Header>
      <div className="fd-main-menu">
        <Container>
          <div className="actions">
            <button
              className="fd-menu-toggle fr-btn fr-btn--tertiary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="fd-main-nav"
            >
              {menuOpen ? <i className="ri-close-line" /> : <i className="ri-menu-line" />}
              Menu
            </button>
            <div className={`fd-nav-wrapper ${menuOpen ? "fd-nav-open" : ""}`} id="fd-main-nav">
              <Nav aria-label="Main navigation">
                <Link current={is("/fundings/home")} href="/fundings/home">
                  <span className="fr-icon-home-4-line fr-mr-1w" aria-hidden="true" />
                  {getI18nLabel("home")}
                </Link>
                <Link current={is("/fundings/structures")} href="/fundings/structures">
                  {getI18nLabel("structures")}
                </Link>
                <Link current={is("/fundings/comparison")} href="/fundings/comparison?year=2023&structures=8k41p&structures=E1Wdn&structures=n2X5f">
                  {getI18nLabel("comparison")}
                </Link>
              </Nav>
            </div>
          </div>
        </Container>
      </div>
      <Outlet />
      <Footer />
      <SwitchTheme />
    </>
  );
}

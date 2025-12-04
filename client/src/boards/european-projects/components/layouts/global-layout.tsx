import { useEffect, useState } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { Button, Header, Logo, Service, FastAccess, Container, Nav, Link } from "@dataesr/dsfr-plus";

import Footer from "./footer";
import SwitchTheme from "../../../../components/switch-theme";
import i18n from "./i18n.json";
import CountrySelector from "../../../../components/country-selector/selector";
import "../styles.scss";

export default function GlobalLayout({ languageSelector = false }) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const filtersParams = searchParams.toString();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!searchParams.get("language") && languageSelector) {
      searchParams.set("language", "fr"); // default value
      setSearchParams(searchParams);
    }
    if (!searchParams.get("country_code")) {
      searchParams.set("country_code", "FRA"); // default value
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, languageSelector]);

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
      <div className="ep-main-menu">
        <Container>
          <div className="actions">
            <button
              className="ep-menu-toggle fr-btn fr-btn--tertiary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="ep-main-nav"
            >
              {menuOpen ? <i className="ri-close-line" /> : <i className="ri-menu-line" />}
              Menu
            </button>
            <div className={`ep-nav-wrapper ${menuOpen ? "ep-nav-open" : ""}`} id="ep-main-nav">
              <Nav aria-label="Main navigation">
                <Link current={is("/european-projects/accueil")} href="/european-projects/accueil">
                  <span className="fr-icon-home-4-line fr-mr-1w" aria-hidden="true" />
                  {getI18nLabel("home")}
                </Link>
                {/* <Link
                  current={
                    is("/european-projects/search") ||
                    is("/european-projects/synthese") ||
                    is("/european-projects/positionnement") ||
                    is("/european-projects/collaborations") ||
                    is("/european-projects/beneficiaires")
                  }
                  href="/european-projects/search"
                >
                  {getI18nLabel("main")}
                </Link> */}
                <Link current={is("/european-projects/msca")} href={`/european-projects/msca?${filtersParams}`}>
                  MSCA
                </Link>
                <Link current={is("/european-projects/erc")} href={`/european-projects/erc?${filtersParams}`}>
                  ERC
                </Link>
                <Link href="/european-projects/evolution-pcri">Evolution des PCRI</Link>
              </Nav>
              <div className="ep-extra-items">
                <span>Lexique</span> {/* TODO : add */}
                <CountrySelector />
              </div>
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

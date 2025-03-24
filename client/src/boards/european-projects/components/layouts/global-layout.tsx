import { useEffect, useState } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import {
  Button,
  Header,
  Logo,
  Service,
  FastAccess,
  Container,
  Nav,
  Link,
  Modal,
  ModalTitle,
  ModalContent,
} from "@dataesr/dsfr-plus";

import Footer from "./footer";
import SwitchTheme from "../../../../components/switch-theme";
import i18n from "./i18n.json";

export default function GlobalLayout({ languageSelector = false }) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const selectedCountry = searchParams.get("country_code") || "FRA";
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const baseUrl =
    pathname +
    "?" +
    Array.from(searchParams.entries())
      .filter(([key]) => key !== "country_code")
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

  return (
    <>
      <Header>
        <Logo text="Ministère|chargé|de l'enseignement|supérieur|et de la recherche" />
        <Service name="dataSupR" tagline={getI18nLabel("tagline")} />
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
          <Button
            aria-controls="fr-theme-modal"
            className="fr-btn fr-icon-theme-fill"
            data-fr-opened="false"
          >
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
                <div
                  className="fr-collapse fr-translate__menu fr-menu"
                  id="translate-1177"
                >
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
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Nav
              aria-label="Main navigation"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <Link
                current={is("/european-projects/accueil")}
                href="/european-projects/accueil"
              >
                <span
                  className="fr-icon-home-4-line fr-mr-1w"
                  aria-hidden="true"
                />
                {getI18nLabel("home")}
              </Link>
              <Link
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
              </Link>
              <Link
                current={is("/european-projects/msca")}
                href="/european-projects/msca"
              >
                MSCA
              </Link>
              <Link
                current={is("/european-projects/erc")}
                href="/european-projects/erc"
              >
                ERC
              </Link>
            </Nav>
            <Button
              icon="global-line"
              onClick={() => {
                setIsModalOpen(true);
              }}
              size="sm"
              variant="tertiary"
            >
              {getI18nLabel("selectedCountry")} {selectedCountry}
            </Button>
            <Modal isOpen={isModalOpen} hide={() => setIsModalOpen(false)}>
              <ModalTitle>{getI18nLabel("selectACountry")}</ModalTitle>
              <ModalContent>
                <Link href={`${baseUrl}&country_code=FRA`}>France</Link>
                <Link href={`${baseUrl}&country_code=DEU`}>Germany</Link>
                <Link href={`${baseUrl}&country_code=ITA`}>Italy</Link>
                <Link href={`${baseUrl}&country_code=ESP`}>Spain</Link>
              </ModalContent>
            </Modal>
          </div>
        </Container>
      </div>
      <Outlet />
      <Footer />
      <SwitchTheme />
    </>
  );
}

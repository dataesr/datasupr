import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Button, Header, Logo, Service, FastAccess } from '@dataesr/dsfr-plus';

import Footer from './footer';
import SwitchTheme from '../components/switch-theme';

export function Layout({ languageSelector = false }) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("language") && languageSelector) {
      searchParams.set("language", "FR"); // default value
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, languageSelector]);

  // TODO: Add file for external translations
  return (
    <>
      <Header>
        <Logo text="Ministère|chargé|de l'enseignement|supérieur|et de la recherche" />
        <Service
          name="dataSupR"
          tagline="Si c'était pas super ça s'appellerait juste data"
        />
        <FastAccess>
          <Button as="a" href="/" icon="github-fill" size="sm" variant="text">
            {searchParams.get("language") === "EN"
              ? "Explore dashboards"
              : "Explorer d'autres tableaux de bord"}
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
            {searchParams.get("language") === "EN"
              ? "Datasets"
              : "Jeux de données"}
          </Button>
          <Button
            aria-controls="fr-theme-modal"
            className="fr-btn fr-icon-theme-fill"
            data-fr-opened="false"
          >
            {searchParams.get("language") === "EN"
              ? "Themes"
              : "Changer de thème"}
          </Button>
          {languageSelector && (
            <nav role="navigation" className="fr-translate fr-nav">
              <div className="fr-nav__item">
                <button
                  className="fr-translate__btn fr-btn fr-btn--tertiary"
                  aria-controls="translate-1177"
                  aria-expanded="false"
                  title="Sélectionner une langue"
                >
                  FR<span className="fr-hidden-lg"> - Français</span>
                </button>
                <div
                  className="fr-collapse fr-translate__menu fr-menu"
                  id="translate-1177"
                >
                  <ul className="fr-menu__list">
                    <li>
                      <Button
                        className="fr-translate__language fr-nav__link"
                        aria-current={
                          searchParams.get("language") === "fr"
                            ? "true"
                            : "false"
                        }
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
                        className="fr-translate__language fr-nav__link"
                        aria-current={
                          searchParams.get("language") === "en"
                            ? "true"
                            : "false"
                        }
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
      <Outlet />
      <Footer />
      <SwitchTheme />
    </>
  );
}


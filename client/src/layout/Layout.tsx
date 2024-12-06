import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Button, Header, Logo, Service, FastAccess } from '@dataesr/dsfr-plus';

import Footer from './footer';
import SwitchTheme from '../components/switch-theme';

export function Layout({ languageSelector = false }) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('language') && languageSelector) {
      searchParams.set("language", "FR"); // default value
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, languageSelector]);

  const handleChange = (e) => {
    searchParams.set("language", e.target.value);
    setSearchParams(searchParams);
  }

  // TODO: Add file for external translations
  return (
    <>
      <Header>
        <Logo text="Ministère | de l'enseignement | supérieur | et de la recherche" />
        <Service name="dataSupR" tagline="Si c'était pas super ça s'appellerait juste data" />
        <FastAccess>
          <Button
            as="a"
            href="/"
            icon="github-fill"
            size="sm"
            variant="text"
          >
            {(searchParams.get('language') === 'FR') ? "Explorer d'autres tableaux de bord" : "Explore dashboards"}
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
            {(searchParams.get('language') === 'FR') ? "Jeux de données" : "Datasets"}
          </Button>
          <Button
            aria-controls="fr-theme-modal"
            className="fr-btn fr-icon-theme-fill"
            data-fr-opened="false"
          >
            {(searchParams.get('language') === 'FR') ? "Changer de thème" : "Themes"}
          </Button>
          {
            languageSelector && (
              <select
                className="fr-select fr-p-0 fr-pl-1w"
                style={{ height: '25px', width: '55px' }}
                onChange={handleChange}
              >
                <option
                  selected={searchParams.get('language') === 'FR'}
                  value="FR"
                >
                  Fr
                </option>
                <option
                  selected={searchParams.get('language') === 'EN'}
                  value="EN"
                >
                  En
                </option>
              </select>
            )
          }
        </FastAccess>
      </Header>
      <Outlet />
      <Footer />
      <SwitchTheme />
    </>
  )
}


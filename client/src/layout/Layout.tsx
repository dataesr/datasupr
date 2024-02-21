import { Button, Header, Logo, Service, FastAccess } from '@dataesr/dsfr-plus';
import { Outlet } from 'react-router-dom';

import Footer from './footer';
import SwitchTheme from '../components/switch-theme';

export function Layout() {
  return (
    <>
      <Header>
        <Logo text="Ministère de | l'enseignement supérieur | et de la recherche" />
        <Service name="dataSupR" tagline="Si c'était pas super ça s'appellerait juste data" />
        <FastAccess>
          <Button as="a" href="/" icon="github-fill" size="sm" variant="text">Explorer d'autres tableaux de bord</Button>
          <Button as="a" href="https://www.systeme-de-design.gouv.fr" target="_blank" rel="noreferer noopener" icon="code-s-slash-line" size="sm" variant="text">Jeux de données</Button>
          <Button className="fr-btn fr-icon-theme-fill" aria-controls="fr-theme-modal" data-fr-opened="false">
            Changer de thème
          </Button>
        </FastAccess>
      </Header>
      <Outlet />
      <Footer />
      <SwitchTheme />
    </>
  )
}


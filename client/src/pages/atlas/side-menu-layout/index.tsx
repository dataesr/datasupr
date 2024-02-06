import { SideMenu, Link, Container, Row, Col, SideMenuItem } from '@dataesr/dsfr-plus';
import { Outlet, useLocation, useSearchParams, useParams } from 'react-router-dom';
import './styles.scss';

export function AtlasSideMenu() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { idFiliere } = useParams();

  console.log('idFiliere', idFiliere);


  if (!pathname) return null;
  const filtersParams = searchParams.toString();

  const is = (str: string): boolean => pathname?.startsWith(str)
  return (
    <Container>
      <Row>
        <Col xs={12} md={3}>
          <SideMenu title="" sticky fullHeight className="padded-sidemenu">
            <Link current={is('/atlas/en-un-coup-d-oeil')} href={`/atlas/en-un-coup-d-oeil?${filtersParams}`}>En un coup d'oeil</Link>

            <SideMenuItem
              defaultExpanded={is('/atlas/effectifs-par-filiere')}
              title="Détails des effectifs"
            >
              <Link current={is('/atlas/effectifs-par-filiere')} href={`/atlas/effectifs-par-filiere?${filtersParams}`}>
                Effectifs par filière</Link>
              <Link current={is('/atlas/effectifs-par-secteurs')} href={`/atlas/effectifs-par-secteurs?${filtersParams}`}>
                Effectifs par secteurs</Link>
              <Link current={is('/atlas/effectifs-par-genre')} href={`/atlas/effectifs-par-genre?${filtersParams}`}>
                Effectifs par genre</Link>
            </SideMenuItem>

            {/* <Link current={false} href="/atlas/en-un-coup-d-oeil">Territoires similaires</Link> */}
            <Link current={false} href={`/atlas/autres-niveaux-geographiques?${filtersParams}`}>Autres niveaux géographiques</Link>
            {/* <Link current={false} href="/atlas/en-un-coup-d-oeil">Tableaux de bords similaires</Link> */}
          </SideMenu>
        </Col>
        <Col xs={12} md={8} className="fr-pt-6w">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

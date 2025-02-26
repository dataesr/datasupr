import { SideMenu, Link, Container, Row, Col } from '@dataesr/dsfr-plus';
import { Outlet, useLocation } from 'react-router-dom';
import './styles.scss';

export default function CustomSideMenu() {
  const { pathname } = useLocation();

  if (!pathname) return null;

  const is = (str: string): boolean => pathname?.startsWith(str)
  return (
    <Container as="nav">
      <Row>
        <Col xs={12} md={3} className="fr-pl-2w">
          <SideMenu title="" sticky fullHeight className="padded-sidemenu">
            <Link
              current={is('/finance-universite/grands-indicateurs')}
              href={'/finance-universite/grands-indicateurs'}
            >
              Grands indicateurs
            </Link>
            <Link
              current={is('/finance-universite/recettes-propres')}
              href={'/finance-universite/recettes-propres'}
            >
              Recettes Propres
            </Link>
            <Link
              current={is('/finance-universite/masse-salariale')}
              href={'/finance-universite/masse-salariale'}
            >
              Masse salariale
            </Link>
            <Link
              current={is('/finance-universite/consommation')}
              href={'/finance-universite/consommation'}
            >
              Consommation
            </Link>
          </SideMenu>
        </Col>
        <Col xs={12} md={8} className="fr-pt-6w">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

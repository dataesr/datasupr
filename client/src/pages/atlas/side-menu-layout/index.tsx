import {
  Container, Row, Col,
  Link,
  SideMenu,
} from '@dataesr/dsfr-plus';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import AtlasMap from '../charts/atlas-map';
import './styles.scss';

export function AtlasSideMenu() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  if (!pathname) return null;
  const filtersParams = searchParams.toString();

  const is = (str: string): boolean => pathname?.startsWith(str)
  return (
    <Container>
      <Row>
        <Col xs={12} md={3}>
          <SideMenu title="" sticky fullHeight>
            <Link current={is('/atlas/general')} href={`/atlas/general?${filtersParams}`}>
              En un coup d'oeil
            </Link>
            <Link current={is('/atlas/effectifs-par-filiere')} href={`/atlas/effectifs-par-filiere?${filtersParams}`}>
              Effectifs par filière</Link>
            <Link current={is('/atlas/effectifs-par-secteurs')} href={`/atlas/effectifs-par-secteurs?${filtersParams}`}>
              Effectifs par secteurs</Link>
            <Link current={is('/atlas/effectifs-par-genre')} href={`/atlas/effectifs-par-genre?${filtersParams}`}>
              Effectifs par genre</Link>
          </SideMenu>
        </Col>
        <Col xs={12} md={9}>
          <AtlasMap />
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

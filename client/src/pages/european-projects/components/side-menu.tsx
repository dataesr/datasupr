import { SideMenu, Link, Container, Row, Col } from '@dataesr/dsfr-plus';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import './styles.scss';

export default function CustomSideMenu() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  if (!pathname) return null;
  const filtersParams = searchParams.toString();

  const is = (str: string): boolean => pathname?.startsWith(str)
  return (
    <Container as="nav">
      <Row>
        <Col xs={12} md={3} className="fr-pl-2w">
          <SideMenu title="" sticky fullHeight className="padded-sidemenu">
            <Link
              current={is('/european-projects/general')}
              href={`/european-projects/general?${filtersParams}`}
            >
              Général
            </Link>
            <Link
              current={is('/european-projects/projets-collaboratifs')}
              href={`/european-projects/projets-collaboratifs?${filtersParams}`}
            >
              Projets collaboratifs
            </Link>
            <Link
              current={is('/european-projects/msca')}
              href={`/european-projects/msca?${filtersParams}`}
            >
              MSCA
            </Link>
            <Link
              current={is('/european-projects/erc')}
              href={`/european-projects/erc?${filtersParams}`}
            >
              ERC
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

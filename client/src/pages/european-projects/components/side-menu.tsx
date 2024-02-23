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
              current={is('/european-projects/analyse')}
              href={`/european-projects/analyse?${filtersParams}`}
            // aria-current={pathname.split('/')[2] === 'general' ? 'page' : undefined}
            >
              Analyse
            </Link>
            <Link
              current={is('/european-projects/liste-des-appels-a-projets')}
              href={`/european-projects/liste-des-appels-a-projets?${filtersParams}`}
            >
              Liste des appels à projets
            </Link>
            <Link
              current={is('/european-projects/chiffres-cles-tableau')}
              href={`/european-projects/chiffres-cles-tableau?${filtersParams}`}
            >
              Chiffres-clés tableau
            </Link>
            <Link
              current={is('/european-projects/objectifs')}
              href={`/european-projects/objectifs?${filtersParams}`}
            >
              Objectifs
            </Link>
            <Link
              current={is('/european-projects/collaborations-chiffrees')}
              href={`/european-projects/collaborations-chiffrees?${filtersParams}`}
            >
              Collaborations chiffrées
            </Link>
            <Link
              current={is('/european-projects/pays')}
              href={`/european-projects/pays?${filtersParams}`}
            >
              Pays
            </Link>
            <Link
              current={is('/european-projects/pays-evolution')}
              href={`/european-projects/pays-evolution?${filtersParams}`}
            >
              Pays évolution
            </Link>
            <Link
              current={is('/european-projects/typologie-des-participants')}
              href={`/european-projects/typologie-des-participants?${filtersParams}`}
            >
              Typologie des participants
            </Link>
            <Link
              current={is('/european-projects/participants-francais')}
              href={`/european-projects/participants-francais?${filtersParams}`}
            >
              Participants français
            </Link>
            <Link
              current={is('/european-projects/participants-tous-pays')}
              href={`/european-projects/participants-tous-pays?${filtersParams}`}
            >
              Participants tous pays
            </Link>
            <Link
              current={is('/european-projects/participants-hors-pays')}
              href={`/european-projects/participants-hors-pays?${filtersParams}`}
            >
              Participants hors pays
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

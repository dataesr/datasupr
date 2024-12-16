import { Container, Row, Col, Link, SideMenu, Title } from "@dataesr/dsfr-plus";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import "./styles.scss";
import { ReactNode } from "react";
import Source from "../components/source";

export function AtlasSideMenu({ title }: { title: ReactNode }) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  if (!pathname) return null;
  const filtersParams = searchParams.toString();

  const is = (str: string): boolean => pathname?.startsWith(str);
  return (
    <Container>
      <Row>
        <Col xs={12} md={3}>
          <SideMenu title="" sticky fullHeight>
            <Link
              current={is("/atlas/general")}
              href={`/atlas/general?${filtersParams}`}
            >
              En un coup d'oeil
            </Link>
            <Link
              current={is("/atlas/effectifs-par-filiere")}
              href={`/atlas/effectifs-par-filiere?${filtersParams}`}
            >
              Effectifs par filière
            </Link>
            <Link
              current={is("/atlas/effectifs-par-secteurs")}
              href={`/atlas/effectifs-par-secteurs?${filtersParams}`}
            >
              Effectifs par secteurs
            </Link>
            <Link
              current={is("/atlas/effectifs-par-genre")}
              href={`/atlas/effectifs-par-genre?${filtersParams}`}
            >
              Effectifs par genre
            </Link>
          </SideMenu>
        </Col>
        <Col xs={12} md={9}>
          <Title as="h1" look="h3" className="fr-mb-5w">
            <span
              className="fr-icon-map-pin-2-line fr-mr-1w"
              aria-hidden="true"
            />
            {title}
          </Title>
          <Outlet />
          <Source />
        </Col>
      </Row>
    </Container>
  );
}

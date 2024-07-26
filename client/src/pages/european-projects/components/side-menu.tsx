import {
  SideMenu,
  Link,
  Container,
  Row,
  Col,
  SideMenuItem,
} from "@dataesr/dsfr-plus";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import "./styles.scss";

export default function CustomSideMenu() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  if (!pathname) return null;
  const filtersParams = searchParams.toString();

  const is = (str: string): boolean => pathname?.startsWith(str);
  return (
    <Container as="nav">
      <Row>
        <Col xs={12} md={4} className="fr-pl-2w">
          <SideMenu title="" sticky fullHeight className="padded-sidemenu">
            <SideMenuItem title="Général" defaultExpanded>
              <Link
                current={is("/european-projects/general/synthese")}
                href={`/european-projects/general/synthese?${filtersParams}`}
              >
                Synthèse
              </Link>
              <Link
                current={is("/european-projects/general/positionnement")}
                href={`/european-projects/general/positionnement?${filtersParams}`}
              >
                Positionnement
              </Link>
              <Link
                current={is("/european-projects/general/evolution")}
                href={`/european-projects/general/evolution?${filtersParams}`}
              >
                Evolution
              </Link>
              <Link
                current={is(
                  "/european-projects/general/objectifs-types-projets"
                )}
                href={`/european-projects/general/objectifs-types-projets?${filtersParams}`}
              >
                Objectifs & types de projets
              </Link>
              <Link
                current={is("/european-projects/general/beneficiaires")}
                href={`/european-projects/general/beneficiaires?${filtersParams}`}
              >
                Bénéficiaires
              </Link>
              <Link
                current={is("/european-projects/general/programme-mires")}
                href={`/european-projects/general/programme-mires?${filtersParams}`}
              >
                Programme MIRES
              </Link>
              <Link
                current={is("/european-projects/general/appel-a-projets")}
                href={`/european-projects/general/appel-a-projets?${filtersParams}`}
              >
                Liste des appels à projets clôturés
              </Link>
              <Link
                current={is("/european-projects/general/donnees-reference")}
                href={`/european-projects/general/donnees-reference?${filtersParams}`}
              >
                Données de référence
              </Link>
              <Link
                current={is("/european-projects/general/informations")}
                href={`/european-projects/general/informations?${filtersParams}`}
              >
                Informations
              </Link>
            </SideMenuItem>
            <Link
              current={is("/european-projects/horizon-europe")}
              href={`/european-projects/horizon-europe?${filtersParams}`}
            >
              HE hors ERC & MSCA
            </Link>
            <Link
              current={is("/european-projects/msca")}
              href={`/european-projects/msca?${filtersParams}`}
            >
              MSCA
            </Link>
            <Link
              current={is("/european-projects/erc")}
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
  );
}

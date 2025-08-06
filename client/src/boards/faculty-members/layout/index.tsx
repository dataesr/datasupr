import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Link,
  Nav,
  Row,
} from "@dataesr/dsfr-plus";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import TitleWithContext from "../components/title-with-context";
import YearSelector from "../components/filters";
import { useBreadcrumbItems, useContextDetection } from "../utils";
import "./styles.scss";
import { useCallback } from "react";
import { SearchBar } from "../components/search-bar";

export function FacultyLayout() {
  const { context, contextId, contextName } = useContextDetection();

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const contextNameCapital = capitalize(contextName);

  const breadcrumbItems = useBreadcrumbItems(
    context,
    contextId,
    contextNameCapital
  );

  const location = useLocation();
  const path = location.pathname;
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleClick = useCallback(
    (url: string) => () => {
      navigate(url);
    },
    [navigate]
  );

  const buildContextualPath = (basePath: string) => {
    const currentPathParts = path.split("/");
    const currentObjectType = currentPathParts[2] || "";
    const baseUrl = `/personnel-enseignant/${currentObjectType}/${basePath}`;
    const existingParams = new URLSearchParams(searchParams);

    if (!existingParams.get("annee_universitaire")) {
      existingParams.set("annee_universitaire", "2023-24");
    }

    const queryString = existingParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return (
    <>
      <div className="title-container">
        <Container>
          <Row>
            <Col md={12}>
              <TitleWithContext />
            </Col>
          </Row>
          <Col md={12}>
            <Breadcrumb className="fr-mb-0">
              <Link href="/personnel-enseignant">
                Accueil personnels enseignants
              </Link>
              {path.startsWith("/personnel-enseignant/glossaire") ? (
                <Link>Glossaire</Link>
              ) : (
                breadcrumbItems.map((item, index) => (
                  <Link key={index} href={item.href}>
                    {item.label}
                  </Link>
                ))
              )}
            </Breadcrumb>
          </Col>
        </Container>
      </div>
      <Container>
        <Row className="fr-mb-4w fr-mt-3w">
          <Col md={8} className="text-left">
            {!path.startsWith("/personnel-enseignant/glossaire") && (
              <Nav>
                <Link
                  current={path.includes(`vue-d'ensemble`)}
                  href={buildContextualPath("vue-d'ensemble")}
                >
                  En un coup d'oeil
                </Link>
                <Link
                  current={path.includes(`typologie`)}
                  href={buildContextualPath("typologie")}
                >
                  Parité Hommes / Femmes
                </Link>
                <Link
                  current={path.includes(`evolution`)}
                  href={buildContextualPath("evolution")}
                >
                  Evolution
                </Link>
                <Link
                  current={path.includes(`enseignants-chercheurs`)}
                  href={buildContextualPath("enseignants-chercheurs")}
                >
                  Enseignants chercheurs
                </Link>
              </Nav>
            )}
          </Col>
          <Col md={4} className="text-right">
            <YearSelector />
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Outlet />
        {path.includes("/glossaire") ? (
          <Container>
            <Row gutters className="fr-mt-4w">
              <Col md={12}>
                <SearchBar />
              </Col>
            </Row>
            <Row gutters className="fr-mt-5w">
              <Col style={{ textAlign: "center" }}>
                <Button
                  onClick={handleClick(
                    "/personnel-enseignant/discipline/vue-d'ensemble"
                  )}
                >
                  Par Grandes disciplines
                </Button>
                <div>
                  <svg
                    className="fr-artwork"
                    aria-hidden="true"
                    viewBox="0 0 80 80"
                    width="200px"
                    height="200px"
                  >
                    <use
                      className="fr-artwork-decorative"
                      href="/artwork/pictograms/leisure/book.svg#artwork-decorative"
                    />
                    <use
                      className="fr-artwork-minor"
                      href="/artwork/pictograms/leisure/book.svg#artwork-minor"
                    />
                    <use
                      className="fr-artwork-major"
                      href="/artwork/pictograms/leisure/book.svg#artwork-major"
                    />
                  </svg>
                </div>
              </Col>
              <Col style={{ textAlign: "center" }}>
                <Button
                  onClick={handleClick(
                    "/personnel-enseignant/geo/vue-d'ensemble"
                  )}
                >
                  Par géographie
                </Button>
                <div>
                  <svg
                    className="fr-artwork"
                    aria-hidden="true"
                    viewBox="0 0 80 80"
                    width="200px"
                    height="200px"
                  >
                    <use
                      className="fr-artwork-decorative"
                      href="/artwork/pictograms/map/location-france.svg#artwork-decorative"
                    />
                    <use
                      className="fr-artwork-minor"
                      href="/artwork/pictograms/map/location-france.svg#artwork-minor"
                    />
                    <use
                      className="fr-artwork-major"
                      href="/artwork/pictograms/map/location-france.svg#artwork-major"
                    />
                  </svg>
                </div>
              </Col>
              <Col style={{ textAlign: "center" }}>
                <Button
                  onClick={handleClick(
                    "/personnel-enseignant/universite/vue-d'ensemble/"
                  )}
                >
                  Par université
                </Button>
                <div>
                  <svg
                    className="fr-artwork"
                    aria-hidden="true"
                    viewBox="0 0 80 80"
                    width="200px"
                    height="200px"
                  >
                    <use
                      className="fr-artwork-decorative"
                      href="/artwork/pictograms/buildings/school.svg#artwork-decorative"
                    />
                    <use
                      className="fr-artwork-minor"
                      href="/artwork/pictograms/buildings/school.svg#artwork-minor"
                    />
                    <use
                      className="fr-artwork-major"
                      href="/artwork/pictograms/buildings/school.svg#artwork-major"
                    />
                  </svg>
                </div>
              </Col>
            </Row>
          </Container>
        ) : (
          <Col md={12} className="text-center fr-mt-4w">
            <div className="fr-mt-1w">
              <Link href="/personnel-enseignant/glossaire" className="fr-link">
                <span
                  className="fr-icon-information-line fr-mr-1w"
                  aria-hidden="true"
                  style={{ fontSize: "1.1em" }}
                />
                Glossaire des termes
              </Link>
            </div>
          </Col>
        )}
      </Container>
    </>
  );
}

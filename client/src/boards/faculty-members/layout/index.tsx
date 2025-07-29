import { Breadcrumb, Col, Container, Link, Nav, Row } from "@dataesr/dsfr-plus";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import SubtitleWithContext from "../components/subtitle-with-context";
import YearSelector from "../components/filters";
import { useBreadcrumbItems, useContextDetection } from "../utils";
import "./styles.scss";

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
              <SubtitleWithContext />
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
      </Container>
    </>
  );
}

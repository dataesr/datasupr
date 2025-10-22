import {
  Breadcrumb,
  Button,
  ButtonGroup,
  Col,
  Container,
  Link,
  Notice,
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
import { useDataCompleteness } from "../hooks/useDataCompleteness";

export function FacultyLayout() {
  const { context, contextId, contextName } = useContextDetection();

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const { hasNonPermanentStaff, isLoading: isLoadingCompleteness } =
    useDataCompleteness();

  const shouldShowNotice = !isLoadingCompleteness && !hasNonPermanentStaff;

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

  const navItems = [
    {
      label: "En un coup d'oeil",
      path: "vue-d'ensemble",
    },
    {
      label: "Parité Hommes / Femmes",
      path: "typologie",
    },
    {
      label: "Evolution",
      path: "evolution",
    },
    {
      label: "Enseignants permanents",
      path: "enseignants-permanents",
    },
  ];

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
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="fr-mt-2w">
          <Col md={8}>
            {!path.startsWith("/personnel-enseignant/glossaire") && (
              <ButtonGroup isInlineFrom="xs" size="sm">
                {navItems.map((item) => (
                  <Button
                    size="sm"
                    key={item.path}
                    onClick={handleClick(buildContextualPath(item.path))}
                    variant={path.includes(item.path) ? "primary" : "secondary"}
                  >
                    {item.label}
                  </Button>
                ))}
              </ButtonGroup>
            )}
          </Col>
          <Col md={4} className="text-right fr-mb-2w">
            <YearSelector />
          </Col>
          {shouldShowNotice && (
            <Notice type="info" className="fr-mb-4w" closeMode="disallow">
              Les données pour cette année universitaire ne sont pas complètes.
              Les informations relatives aux personnels enseignants{" "}
              NON-PERMANENTS, sont encore en cours de collecte et de validation.
              Les analyses présentées ici pourraient donc évoluer une fois
              l'ensemble des données disponibles.
            </Notice>
          )}
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

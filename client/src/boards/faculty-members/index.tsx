import { Button, Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./components/search-bar";
import { useFacultyMembersYears } from "./api/general-queries";
import { GlossaryTerm } from "./components/glossary/glossary-tooltip";
import NavigationCards from "./components/navigation-cards/navigation-cards";
import { useTitle } from "../../hooks/usePageTitle";

export function FacultyMembers() {
  const navigate = useNavigate();
  const { data: yearsData } = useFacultyMembersYears();

  useTitle(`dataSupR - Personnel enseignant`);

  const yearToUse =
    yearsData?.complete_years?.[0] || yearsData?.available_years?.[0];

  const goTo = (url: string) => {
    if (yearToUse) {
      navigate(`${url}?annee_universitaire=${yearToUse}`);
    } else {
      navigate(url);
    }
  };

  return (
    <>
      <div className="title-container">
        <Container>
          <Row>
            <Col md={12}>
              <Title
                as="h2"
                look="h1"
                className="fr-text-title--blue-france fr-mt-2w"
              >
                Le personnel enseignant
              </Title>
            </Col>
          </Row>
          <Row gutters className="fr-mt-4w">
            <Col md={12}>
              <SearchBar />
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row gutters className="fr-mt-5w">
          <Col>
            <p className="fr-text--lead text-center fr-mb-4w">
              Explorez les effectifs du personnel enseignant selon trois axes
            </p>
            <div className="fr-mb-3w">
              <Row gutters>
                <Col style={{ textAlign: "center" }}>
                  <Button
                    size="sm"
                    onClick={() =>
                      goTo("/personnel-enseignant/discipline/vue-d'ensemble")
                    }
                  >
                    Par grandes disciplines
                  </Button>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Accéder à la vue par grandes disciplines"
                    onClick={() =>
                      goTo("/personnel-enseignant/discipline/vue-d'ensemble")
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goTo("/personnel-enseignant/discipline/vue-d'ensemble");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      className="fr-artwork"
                      aria-hidden="true"
                      viewBox="0 0 80 80"
                      width="110px"
                      height="110px"
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
                    size="sm"
                    onClick={() =>
                      goTo("/personnel-enseignant/geo/vue-d'ensemble")
                    }
                  >
                    Par géographie
                  </Button>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Accéder à la vue par géographie"
                    onClick={() =>
                      goTo("/personnel-enseignant/geo/vue-d'ensemble")
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goTo("/personnel-enseignant/geo/vue-d'ensemble");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      className="fr-artwork"
                      aria-hidden="true"
                      viewBox="0 0 80 80"
                      width="110px"
                      height="110px"
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
                    size="sm"
                    onClick={() =>
                      goTo("/personnel-enseignant/universite/vue-d'ensemble/")
                    }
                  >
                    Par université
                  </Button>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Accéder à la vue par université"
                    onClick={() =>
                      goTo("/personnel-enseignant/universite/vue-d'ensemble/")
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goTo(
                          "/personnel-enseignant/universite/vue-d'ensemble/"
                        );
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      className="fr-artwork"
                      aria-hidden="true"
                      viewBox="0 0 80 80"
                      width="110px"
                      height="110px"
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
            </div>
            <p className="fr-mb-2w">
              Sur chaque page "globale", vous voyez le cumul des données de
              l'axe choisi: parité femmes/hommes et répartition entre personnels{" "}
              <GlossaryTerm term="permanent / non permanent">
                permanents et non permanents
              </GlossaryTerm>
              .
            </p>
            <p className="fr-mb-2w">
              Cliquez ensuite sur une entité (ex: une{" "}
              <GlossaryTerm term="grande discipline">
                grande discipline
              </GlossaryTerm>{" "}
              comme "Sciences", une région/une académie ou une université) pour
              obtenir la même page focalisée sur cette entité. La structure
              reste identique pour faciliter la comparaison.
            </p>
            <p className="fr-mb-3w">
              Vous pouvez changer l'année universitaire à tout moment via le
              sélecteur en haut à droite.
            </p>
          </Col>
        </Row>
        <Row gutters>
          <Col className="text-center">
            <Text size="sm">
              Découvrez aussi les effectifs du personnels enseignants selon une
              entité précise
            </Text>
          </Col>
        </Row>
        <Row gutters className="fr-mt-3w">
          <Col md={4}>
            <NavigationCards type="fields" maxItems={2} />
          </Col>
          <Col md={4}>
            <NavigationCards type="regions" maxItems={2} />
          </Col>
          <Col md={4}>
            <NavigationCards type="structures" maxItems={2} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

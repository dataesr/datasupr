import { Button, Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./components/search-bar";
import { useFacultyMembersYears } from "./api/general-queries";
import { GlossaryTerm } from "./components/glossary/glossary-tooltip";
import NavigationCards from "./components/navigation-cards/navigation-cards";
import { useTitle } from "../../hooks/usePageTitle";
import "./styles.scss";

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
  console.log("yearsData", yearsData);

  return (
    <>
      <div className="title-container heroSection">
        <Container>
          <Row>
            <Col md={12} className="heroTitle">
              <Title
                as="h1"
                look="h1"
                className="fr-text-title--blue-france fr-mb-2w"
              >
                📚 Le personnel enseignant
              </Title>
              <Text size="lg" className="fr-mb-4w heroDescription">
                Explorez les données sur les effectifs des personnels
                enseignants de l'enseignement supérieur français
              </Text>
            </Col>
          </Row>
          <Row gutters>
            <Col md={12}>
              <div className="searchBarContainer">
                <SearchBar />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row gutters className="fr-mt-6w fr-mb-2w">
          <Col md={12}>
            <Text bold className="sectionSubtitle">
              🔍 Choisissez votre angle d'analyse
            </Text>
            <Text className="sectionSubtitle ">
              Explorez les effectifs du personnel enseignant selon trois axes
              complémentaires
            </Text>
          </Col>
        </Row>

        <Row gutters className="fr-mb-7w">
          <Col md={4}>
            <div
              role="button"
              tabIndex={0}
              aria-label="Accéder à la vue par grandes disciplines"
              className="navCard"
              onClick={() =>
                goTo("/personnel-enseignant/discipline/vue-d'ensemble")
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goTo("/personnel-enseignant/discipline/vue-d'ensemble");
                }
              }}
            >
              <svg
                className="fr-artwork navCardIcon"
                aria-hidden="true"
                viewBox="0 0 80 80"
                width="120px"
                height="120px"
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
              <Title as="h3" look="h5" className="fr-mb-2w">
                Par grandes disciplines
              </Title>
              <Text size="sm" className="navCardDescription">
                Analysez la répartition des enseignants selon les domaines
                d'enseignement
              </Text>
              <Button
                size="sm"
                className="fr-mt-3w"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo("/personnel-enseignant/discipline/vue-d'ensemble");
                }}
              >
                Explorer
              </Button>
            </div>
          </Col>

          <Col md={4}>
            <div
              role="button"
              tabIndex={0}
              aria-label="Accéder à la vue par géographie"
              className="navCard"
              onClick={() => goTo("/personnel-enseignant/geo/vue-d'ensemble")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goTo("/personnel-enseignant/geo/vue-d'ensemble");
                }
              }}
            >
              <svg
                className="fr-artwork navCardIcon"
                aria-hidden="true"
                viewBox="0 0 80 80"
                width="120px"
                height="120px"
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
              <Title as="h3" look="h5" className="fr-mb-2w">
                Par géographie
              </Title>
              <Text size="sm" className="navCardDescription">
                Découvrez la répartition territoriale par régions et académies
              </Text>
              <Button
                size="sm"
                className="fr-mt-3w"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo("/personnel-enseignant/geo/vue-d'ensemble");
                }}
              >
                Explorer
              </Button>
            </div>
          </Col>

          <Col md={4}>
            <div
              role="button"
              tabIndex={0}
              aria-label="Accéder à la vue par université"
              className="navCard"
              onClick={() =>
                goTo("/personnel-enseignant/universite/vue-d'ensemble/")
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goTo("/personnel-enseignant/universite/vue-d'ensemble/");
                }
              }}
            >
              <svg
                className="fr-artwork navCardIcon"
                aria-hidden="true"
                viewBox="0 0 80 80"
                width="120px"
                height="120px"
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
              <Title as="h3" look="h5" className="fr-mb-2w">
                Par université
              </Title>
              <Text size="sm" className="navCardDescription">
                Consultez les données par établissement d'enseignement supérieur
              </Text>
              <Button
                size="sm"
                className="fr-mt-3w"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo("/personnel-enseignant/universite/vue-d'ensemble/");
                }}
              >
                Explorer
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="fr-mb-6w">
          <Col md={12}>
            <div className="infoSection">
              <Title as="h3" look="h6" className="fr-mb-2w">
                💡 Comment utiliser ces données ?
              </Title>
              <div className="infoContent">
                <Text size="sm">
                  <strong>Vue globale :</strong> Sur chaque page "globale", vous
                  voyez le cumul des données de l'axe choisi : parité
                  femmes/hommes et répartition entre personnels{" "}
                  <GlossaryTerm term="permanent / non permanent">
                    permanents et non permanents
                  </GlossaryTerm>
                  .
                </Text>
                <Text size="sm">
                  <strong>Navigation détaillée :</strong> Cliquez ensuite sur
                  une entité (ex: une{" "}
                  <GlossaryTerm term="grande discipline">
                    grande discipline
                  </GlossaryTerm>{" "}
                  comme "Sciences", une région/académie ou une université) pour
                  obtenir la même page focalisée sur cette entité. La structure
                  reste identique pour faciliter la comparaison.
                </Text>
                <Text size="sm">
                  <strong>Sélection d'année :</strong> Vous pouvez changer
                  l'année universitaire à tout moment via le sélecteur en haut à
                  droite de l'écran.
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="fr-mb-7w">
          <Col md={12}>
            <div className="quickAccessSection">
              <Title as="h3" look="h4" className="sectionTitle fr-mb-2w">
                🚀 Accès rapide
              </Title>
              <Text className="quickAccessSubtitle fr-mb-4w">
                Découvrez directement les effectifs du personnel enseignant
                selon une entité précise, exemple :
              </Text>
              <Row gutters>
                <Col md={4}>
                  <div className="quickAccessCard">
                    <Title as="h4" look="h6" className="fr-mb-3w">
                      📖 Disciplines
                    </Title>
                    <NavigationCards type="fields" maxItems={2} />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="quickAccessCard">
                    <Title as="h4" look="h6" className="fr-mb-3w">
                      🗺️ Régions
                    </Title>
                    <NavigationCards type="regions" maxItems={2} />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="quickAccessCard">
                    <Title as="h4" look="h6" className="fr-mb-3w">
                      🏫 Établissements
                    </Title>
                    <NavigationCards type="structures" maxItems={2} />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

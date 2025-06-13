import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Link,
  Row,
  Title,
} from "@dataesr/dsfr-plus";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./components/search-bar";

export function FacultyMembers() {
  const navigate = useNavigate();

  const handleClick =
    (url: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      navigate(url);
    };

  return (
    <Container>
      <Breadcrumb className="fr-m-0 fr-mt-1w">
        <Link href="/">Accueil</Link>
        <Link>
          <strong>Dashboard </strong>
        </Link>
      </Breadcrumb>
      <Title as="h2" look="h5" className="fr-mt-5w">
        Le personnel enseignant
      </Title>
      <Row>
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
            Par discipline
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
            onClick={handleClick("/personnel-enseignant/geo/vue-d'ensemble")}
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
  );
}

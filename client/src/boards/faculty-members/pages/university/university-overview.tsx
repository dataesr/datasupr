import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
} from "@dataesr/dsfr-plus";

export default function UniversityOverview() {
  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link>
              <strong>En un coup d'oeil</strong>
            </Link>
          </Breadcrumb>
          <Title as="h3" look="h5" className="fr-mt-5w">
            Les disciplines en un coup d'oeil
          </Title>
        </Col>
        <Col md={3} style={{ textAlign: "right" }}></Col>
      </Row>
      <Row>
        <Col md={8} style={{ textAlign: "center" }}></Col>
        <Col md={4} style={{ textAlign: "center" }}></Col>
      </Row>
      <Row gutters className="fr-mt-3w"></Row>
    </Container>
  );
}

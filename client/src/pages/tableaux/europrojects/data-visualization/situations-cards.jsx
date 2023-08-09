import {
  Container, Col, Row,
  Text,
  Tile, TileBody,
  Title,
} from "@dataesr/react-dsfr";

export default function SituationCard({ data }) {
  return (
    <Container as="section">
      <Row>
        <Col>
          <Title as="h3" look="h6">share_signed</Title>
        </Col>
      </Row>
      <Row gutters>
        {data.FR.map((item) => (
          <Col n="3" key={`${item.code_indic}-share_signed`}>
            <Tile>
              <TileBody>
                <h2> {item.data[0].share_signed.toFixed(1)} %</h2>
                <Text>{item.code_indic}</Text>
              </TileBody>
            </Tile>
          </Col>
        ))}
      </Row>
      <Row className="fr-mt-5w">
        <Col>
          <Title as="h3" look="h6">success</Title>
        </Col>
      </Row>
      <Row gutters>
        {data.FR.map((item) => (
          <Col n="3" key={`${item.code_indic}-success`}>
            <Tile>
              <TileBody>
                <h2>{item.data[0].success.toFixed(1)} %</h2>
                <Text>{item.code_indic}</Text>

              </TileBody>
            </Tile>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

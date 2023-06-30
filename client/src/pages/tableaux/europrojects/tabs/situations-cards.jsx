import { Col, Row, Text, Tile, TileBody } from "@dataesr/react-dsfr";

export default function SituationCard({ data }) {
  return (
    <Row gutters>
      {data.FR.map((item) => (
        <Col n="3">
          <Tile>
            <TileBody>
              <h2> {item.data[0].share_signed} %</h2>
              <Text> Texte à modifier</Text>
            </TileBody>
          </Tile>
        </Col>
      ))}
      {data.FR.map((item) => (
        <Col n="3">
          <Tile>
            <TileBody>
              <h2>{item.data[0].success.toFixed(2)} %</h2>
              <Text> Texte à modifier</Text>
            </TileBody>
          </Tile>
        </Col>
      ))}
    </Row>
  );
}

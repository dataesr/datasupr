import { Container, Col, Row } from "@dataesr/dsfr-plus";
import "./styles.scss";

export default function DefaultSkeleton({
  col = 1,
  height = "400px",
}: {
  col?: number;
  height?: string;
}) {
  return (
    <Container fluid>
      <Row gutters>
        {[...Array(col)].map((_, i) => (
          <Col key={i}>
            <div style={{ height }} className="default-skeleton" />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

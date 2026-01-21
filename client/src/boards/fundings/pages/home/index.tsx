import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import CustomBreadcrumb from "../../../../components/custom-breadcrumb";
import navigationConfig from "../navigation-config.json";


export default function Home() {
  return (
    <Container className="fr-pt-3w">
      <CustomBreadcrumb config={navigationConfig} />
      <Row gutters>
        <Col>
          <Title>Méthodologie</Title>
          <div>Page en construction</div>
        </Col>
      </Row>
    </Container>
  );
}

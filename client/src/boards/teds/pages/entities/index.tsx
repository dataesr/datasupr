import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import BoardsSuggestComponent from "../../../../components/boards-suggest-component";
import Callout from "../../../../components/callout";
import { getI18nLabel } from "../../../../utils";
import IpccInstitutions from "../../charts/ipcc-institutions";
import i18n from "./i18n.json";


export default function Entities() {
  return (
    <Container as="main" className="fr-mt-5w">
      <Row>
        <Col md={12}>
          <Title as="h1" className="fr-mb-2w">
            {getI18nLabel(i18n, "title")}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Title as="h2" className="fr-mb-2w">
            {getI18nLabel(i18n, "subtitle")}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Callout className="bg2">{getI18nLabel(i18n, "description")}</Callout>
        </Col>
      </Row>
      <Row gutters className="chart-bg2">
        <Col md={12}>
          <IpccInstitutions />
        </Col>
      </Row>
      <BoardsSuggestComponent />
    </Container>
  );
}

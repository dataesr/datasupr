import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import Breadcrumb from "../../components/breadcrumb";

export default function County() {
  return (
    <>
      <Container fluid className="funding-gradient">
        <Container as="section">
          <Row gutters>
            <Col>
              <Breadcrumb items={[
                { href: "/financements-par-aap/accueil", label: "Financements par AAP" },
                { label: "Vue par région" },
              ]} />
            </Col>
          </Row>
          <Row gutters className="fr-grid-row--middle">
            <Col md="9">
              <Title as="h1" look="h4" className="fr-mb-1v">
                Vue par région
              </Title>
              {/* <Text size="sm" className="fr-mb-0 fr-text-mention--grey">
                {structures.length < 2
                  ? "Sélectionnez au moins deux établissements ci-dessous pour comparer leurs financements via les appels à projets. Vous pouvez filtrer par région et par typologie."
                  : `${structures.length} établissements sélectionnés`}
              </Text> */}
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  )
}
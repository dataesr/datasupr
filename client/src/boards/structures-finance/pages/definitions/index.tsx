import { Container, Row, Col } from "@dataesr/dsfr-plus";
import Definitions from "../../../../components/definitions";
import { useFinanceDefinitions } from "./api";
import Breadcrumb from "../../../financements-par-aap/components/breadcrumb";

export default function DefinitionsView() {
  const { data, isLoading, error } = useFinanceDefinitions();

  if (isLoading) {
    return (
      <Container className="fr-my-6w">
        <Row>
          <Col>
            <p className="fr-text--center">Chargement...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="fr-my-6w">
        <Row>
          <Col>
            <div className="fr-alert fr-alert--error">
              <p className="fr-alert__title">Erreur</p>
              <p>
                {error instanceof Error
                  ? error.message
                  : "Une erreur est survenue"}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <main role="main">
      <Container fluid className="etablissement-selector__wrapper">
        <Container as="section">
          <Row>
            <Col>
              <Breadcrumb
                items={[
                  { label: "Accueil", href: "/structures-finance/accueil" },
                  { label: "Définitions" },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 className="fr-h1">Définitions des indicateurs</h3>
              <p className="fr-text--lead fr-mb-4w">
                Retrouvez les définitions détaillées de tous les indicateurs
                financiers utilisés dans les tableaux de bord.
              </p>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container>
        <Row className="fr-my-6w">
          <Col>
            <Definitions data={data || []} />
          </Col>
        </Row>
      </Container>
    </main>
  );
}

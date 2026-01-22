import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import Definitions from "../../../../components/definitions";
import { useFinanceDefinitions } from "./api";
import CustomBreadcrumb from "../../../../components/custom-breadcrumb";
import navigationConfig from "../../navigation-config.json";

export default function DefinitionsView() {
  const [searchParams] = useSearchParams();
  const language = searchParams.get("language") || "fr";
  const { data, isLoading, error } = useFinanceDefinitions(language);

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
              <CustomBreadcrumb config={navigationConfig} />
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

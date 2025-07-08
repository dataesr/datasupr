import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Link,
  Title,
  Notice,
} from "@dataesr/dsfr-plus";
import { AgeEvolutionChart } from "./chart/age-evolution/age-evolution";
import { StatusEvolutionChart } from "./chart/status/status";
import { TrendsChart } from "./chart/trend/trends";
import { useBreadcrumbItems, useContextDetection } from "../../utils";
import SubtitleWithContext from "../typology/utils/subtitle-with-context";

export function Evolution() {
  const { context, contextId, contextName } = useContextDetection();

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const contextNameCapital = capitalize(contextName);

  const breadcrumbItems = useBreadcrumbItems(
    context,
    contextId,
    contextNameCapital
  );

  return (
    <Container as="main">
      <Row>
        <Col md={12}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">
              Accueil personnels enseignants
            </Link>
            {breadcrumbItems.map((item, index) => (
              <Link key={index} href={item.href}>
                {item.label}
              </Link>
            ))}
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="fr-my-3w">
        <Notice closeMode={"disallow"} type={"warning"}>
          Les données des personnels enseignants non permanents ne sont pas
          prises en compte pour l'année car elles ne sont pas disponibles.
        </Notice>
      </Row>

      <Title as="h1" look="h3" className="fr-mt-2w fr-mb-3w">
        L'évolution du personnel enseignant par {contextName}&nbsp;
        <i>
          <SubtitleWithContext classText="fr-text--lead" />
        </i>
      </Title>

      <Row gutters className="fr-mb-5w">
        <Col>
          <TrendsChart />
        </Col>
      </Row>
      <Row gutters className="fr-mb-5w">
        <Col>
          <StatusEvolutionChart />
        </Col>
      </Row>
      <Row gutters className="fr-mb-5w">
        <Col>
          <AgeEvolutionChart />
        </Col>
      </Row>
    </Container>
  );
}

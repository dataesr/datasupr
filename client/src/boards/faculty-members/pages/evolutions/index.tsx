import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Link,
  Title,
} from "@dataesr/dsfr-plus";
import { AgeEvolutionChart } from "./chart/age-evolution/age-evolution";
import { StatusEvolutionChart } from "./chart/status/status";
import { TrendsChart } from "./chart/trend/trends";
import SubtitleWithContext from "../research-teachers/utils/get-title";
import { useBreadcrumbItems, useContextDetection } from "../../utils";

export function Evolution() {
  const { context, contextId, contextName } = useContextDetection();

  const breadcrumbItems = useBreadcrumbItems(context, contextId, contextName);

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
          <Title
            as="h3"
            look="h5"
            className="fr-mt-2w fr-mb-3w"
            style={{
              backgroundColor: "var(--background-alt-blue-france)",
              padding: "1.0rem 0.5rem 0.1rem 0.5rem",
              borderLeft: "6px solid var(--blue-france-main-525)",
            }}
          >
            L'évolution du Personnel Enseignant
            <i>
              <SubtitleWithContext classText="" />
            </i>
          </Title>{" "}
        </Col>
      </Row>

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

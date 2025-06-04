import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Notice,
} from "@dataesr/dsfr-plus";
import FieldsDistributionBar from "../../charts/general/general";
import CnuGroupsChart from "../../charts/cnu-group/cnu-chart";
import StatusDistribution from "../../charts/status/status";
import { AgeDistributionPieChart } from "../../charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card";
import YearSelector from "../../../faculty-members/filters";
import { EstablishmentTypeChart } from "../../charts/establishment-type/establishment";
import DisciplineStatsSidebar from "../../components/top-fields-indicators";
import DisciplineStatusSummary from "../../components/fields-by-status";
import FacultyMap from "./components/map";
import NavigationCards from "../../components/fields-cards";

export default function RegionsOverview() {
  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-pt-3w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link>
              <strong>Données nationale</strong>
            </Link>
          </Breadcrumb>
        </Col>
        <Col md={3} style={{ textAlign: "right" }}>
          <YearSelector />
        </Col>
      </Row>
      <Row className="fr-mt-3w">
        <Notice closeMode={"disallow"} type={"warning"}>
          Les données des personnels enseignants non permanents ne sont pas
          prises en compte pour l'année car elles ne sont pas disponibles.
        </Notice>
        <Title as="h3" look="h5" className="fr-mt-2w">
          Explorer le personnel enseignant au niveau national
        </Title>
      </Row>
      <Row>
        <Col md={8} className="fr-pr-8w">
          <FacultyMap />
          <FieldsDistributionBar />
          <CnuGroupsChart />
          <StatusDistribution />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea repellat
          corporis est laudantium consequuntur consectetur, odit temporibus!
          Eligendi, vitae. Vero, harum molestias? Repellendus voluptatem non
          aperiam? Enim ab obcaecati non?
          <div className="fr-mt-3w">
            <AgeDistributionPieChart />
          </div>
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <GeneralIndicatorsCard />
          <DisciplineStatsSidebar />
          <DisciplineStatusSummary />
        </Col>
      </Row>
      <Row>
        <EstablishmentTypeChart />
      </Row>
      <Row className="fr-mt-4w fr-mb-5w">
        <Col>
          <Title as="h4" look="h5">
            Explorer par discipline
          </Title>
          <NavigationCards type="regions" maxItems={12} />
        </Col>
      </Row>
    </Container>
  );
}

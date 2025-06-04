import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Text,
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
import { useSearchParams } from "react-router-dom";
import NavigationCards from "../../components/fields-cards";

export default function FieldOverview() {
  const [searchParams] = useSearchParams();
  const field_id = searchParams.get("field_id");

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-pt-3w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link>
              <strong>Les Grandes disciplines</strong>
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
          Explorer le personnel enseignant par grande discipline
        </Title>
      </Row>
      <Row gutters>
        <Col md={8} className="fr-pr-8w">
          <Text>
            Desriptif de notre référentiel des disciplines, limites et
            périmètres. <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            vitae lobortis sem. Quisque vel ex a elit facilisis rhoncus. Morbi
            eleifend bibendum orci vel aliquet. Fusce a neque dui. Cras molestie
            quam quis libero ullamcorper viverra. Sed rutrum placerat nibh ut
            tristique. Cras egestas felis a scelerisque dignissim. Donec
            placerat nulla dapibus, efficitur ex non, vehicula sapien. Aenean
            vehicula vitae eros ut egestas. Maecenas lorem massa, vulputate id
            leo id, aliquet ornare mi. Etiam vitae ipsum ipsum. Cras fermentum
            lobortis mauris eget malesuada. Sed in consequat elit, eu fringilla
            magna.
          </Text>
          {!field_id && <FieldsDistributionBar />}
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
          {!field_id && <DisciplineStatsSidebar />}
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
          <NavigationCards type="fields" maxItems={12} />
        </Col>
      </Row>
    </Container>
  );
}

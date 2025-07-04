import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Text,
  Notice,
  Link,
} from "@dataesr/dsfr-plus";
import FieldsDistributionBar from "../../charts/general/general";
import CnuGroupsChart from "../../charts/cnu-group/cnu-chart";
import StatusDistribution from "../../charts/status/status";
import { AgeDistributionPieChart } from "../../charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { EstablishmentTypeChart } from "../../charts/establishment-type/establishment";
import DisciplineStatsSidebar from "../../components/top-indicators/top-fields-indicators";
import DisciplineStatusSummary from "../../components/fields-by-status";
import NavigationCards from "../../components/fields-cards";
import YearSelector from "../../components/filters";
import { useBreadcrumbItems, useContextDetection } from "../../utils";

export default function FieldOverview() {
  const { context, contextId, contextName } = useContextDetection();

  const breadcrumbItems = useBreadcrumbItems(context, contextId, contextName);

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
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
        <Col md={3} style={{ textAlign: "right" }}>
          <YearSelector />
        </Col>
      </Row>
      <Row className="fr-mt-3w">
        <Notice closeMode={"disallow"} type={"warning"}>
          Les données des personnels enseignants non permanents ne sont pas
          prises en compte pour l'année car elles ne sont pas disponibles.
        </Notice>
      </Row>
        <Title as="h3" look="h5" className="fr-mt-2w">
          Explorer le personnel enseignant par grande discipline
        </Title>
      <Row>
        <Col md={8} className="fr-pr-8w">
          <Text className="fr-pr-8w">
            Descriptif de notre référentiel des disciplines, limites et
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
          <div className="fr-mt-5w">
            <FieldsDistributionBar />
          </div>
          <div className="fr-mt-5w">
            <CnuGroupsChart />
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatem sit quod veniam quam odio a earum deserunt minima velit
              minus cumque explicabo, ducimus porro inventore. Veniam autem
              error cupiditate eum. Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Similique exercitationem totam suscipit, vel
              ipsum nobis commodi ut omnis ipsa aspernatur nostrum atque odio
              praesentium corrupti! Quidem consectetur voluptatem laudantium
              nam.
            </Text>
          </div>
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <div className="fr-mb-5w">
            <GeneralIndicatorsCard />
          </div>
          <div className="fr-mt-5w">
            <DisciplineStatsSidebar />
          </div>
          <div className="fr-mt-5w">
            <DisciplineStatusSummary />
          </div>
          <div className="fr-mt-3w">
            <AgeDistributionPieChart />
          </div>
        </Col>
        <Col>
          <div className="fr-pr-8w">
            <StatusDistribution />
            <Text size="sm" className="fr-mt-2w">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
              repellat corporis est laudantium consequuntur consectetur, odit
              temporibus! Eligendi, vitae. Vero, harum molestias? Repellendus
              voluptatem non aperiam? Enim ab obcaecati non?
            </Text>
          </div>
          <EstablishmentTypeChart />
        </Col>
      </Row>
      <Row className="fr-mt-4w fr-mb-5w">
        <Col>
          <Title as="h4" look="h5">
            Explorer par discipline
          </Title>
          <NavigationCards type="fields" maxItems={25} />
        </Col>
      </Row>
    </Container>
  );
}

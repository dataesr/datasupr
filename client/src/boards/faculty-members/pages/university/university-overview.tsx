import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Notice,
  Link,
  Text,
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

export default function RegionsOverview() {
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
        Explorer le personnel enseignant au niveau national
      </Title>
      <Row>
        <Col md={9} className="fr-pr-8w">
          <Text className="fr-pr-8w">
            Descriptif de la répartition géographique des personnels enseignants
            en France métropolitaine et d'outre-mer.
            <br />
            Cette page présente la répartition des personnels enseignants par
            université et composante, avec une visualisation de l'équilibre
            femmes-hommes dans chaque universités. Les données présentées sur
            cette page sont la sommes des données des universités. Les barres
            horizontales permettent de comparer facilement les effectifs totaux
            entre universités, tandis que les segments colorés illustrent la
            proportion respective des enseignants par genre. Le tableau associé
            détaille les effectifs précis et les pourcentages par université.
          </Text>

          <div className="fr-mt-5w">
            <FieldsDistributionBar />
          </div>
          <div className="fr-mt-3w">
            <AgeDistributionPieChart />
          </div>
        </Col>
        <Col md={3} style={{ textAlign: "center" }}>
          <div className="fr-mb-5w">
            <GeneralIndicatorsCard />
          </div>
          <div className="fr-mt-5w">
            <DisciplineStatsSidebar />
          </div>
          <div className="fr-mt-5w">
            <DisciplineStatusSummary />
          </div>
        </Col>
        <Col>
          <div className="fr-mt-5w">
            <CnuGroupsChart />
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatem sit quod veniam quam odio a earum deserunt minima velit
              minus cumque explicabo, ducimus porro inventore. Veniam autem
              error cupiditate eum.
            </Text>
          </div>
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
            Explorer par régions
          </Title>
          <NavigationCards type="regions" maxItems={12} />
        </Col>
      </Row>
    </Container>
  );
}

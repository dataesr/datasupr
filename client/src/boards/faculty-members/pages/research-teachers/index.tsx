import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
} from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";
import ResearchTeachersOverviewTable from "./table/overview";
import YearSelector from "../../components/filters";

export function ResearchTeachers() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("année_universitaire") || "";

  const field_id = searchParams.get("field_id");
  const geo_id = searchParams.get("geo_id");
  const structure_id = searchParams.get("structure_id");

  const { context, contextId, contextName } = useContextDetection();

  const getBreadcrumbData = () => {
    switch (context) {
      case "fields":
        return {
          overviewUrl: "/personnel-enseignant/discipline/vue-d'ensemble/",
          currentContext:
            field_id && contextName
              ? `Les enseignants chercheurs en ${contextName}`
              : null,
        };
      case "geo":
        return {
          overviewUrl: "/personnel-enseignant/geo/vue-d'ensemble/",
          currentContext:
            geo_id && contextName
              ? `Les enseignants chercheurs en ${contextName}`
              : null,
        };
      case "structures":
        return {
          overviewUrl: "/personnel-enseignant/universite/vue-d'ensemble/",
          currentContext:
            structure_id && contextName
              ? `Les enseignants chercheurs de ${contextName}`
              : null,
        };
      default:
        return {
          overviewUrl: "/personnel-enseignant/",
          currentContext: null,
        };
    }
  };

  const { overviewUrl, currentContext } = getBreadcrumbData();

  const getContextTitle = () => {
    switch (context) {
      case "fields":
        return contextId
          ? "Répartition par groupes CNU"
          : "Répartition par disciplines";
      case "geo":
        return contextId
          ? "Répartition par groupes CNU"
          : "Répartition par régions";
      case "structures":
        return contextId
          ? "Répartition par groupes CNU"
          : "Répartition par établissements";
      default:
        return "Répartition des enseignants-chercheurs";
    }
  };

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link href={overviewUrl}>Vue d'ensemble</Link>
            {currentContext && <Link>{currentContext}</Link>}
          </Breadcrumb>
        </Col>
        <Col md={3} style={{ textAlign: "right" }}>
          <YearSelector />
        </Col>
      </Row>

      <Row gutters className="fr-mt-4w">
        <Col md={8}>
          <Title as="h2" look="h4" className="fr-mb-2w">
            {getContextTitle()}
          </Title>
          <ResearchTeachersOverviewTable
            context={context}
            année_universitaire={selectedYear}
            contextId={contextId}
          />
        </Col>
      </Row>

      {contextId && (
        <Row gutters className="fr-mt-5w">
          <Col md={8}>
            <Title as="h2" look="h4" className="fr-mb-2w">
              Répartition par groupes CNU {contextName && `en ${contextName}`}
            </Title>
            <CnuGroupsTable
              context={context}
              contextId={contextId}
              année_universitaire={selectedYear}
            />
            <div className="fr-text--xs fr-mt-1w fr-mb-4w">
              <i>
                <strong>Répartition par groupes CNU</strong>
                <br />
                Ce tableau présente la répartition des enseignants-chercheurs
                par groupe CNU {contextName && `en ${contextName}`}. Les données
                permettent d'analyser la distribution par genre.
              </i>
            </div>
          </Col>
        </Row>
      )}

      {contextId && (
        <Row gutters className="fr-mt-5w">
          <Col md={12}>
            <Title as="h2" look="h4" className="fr-mb-2w">
              Répartition par sections CNU {contextName && `en ${contextName}`}
            </Title>
            <CnuSectionsTable
              context={context}
              contextId={contextId}
              année_universitaire={selectedYear}
              showDiscipline={false}
              showGroup={true}
              showAgeDemographics={true}
            />
            <div className="fr-text--xs fr-mt-1w">
              <i>
                <strong>Répartition par sections CNU</strong>
                <br />
                Ce tableau présente la répartition des enseignants-chercheurs
                par section CNU {contextName && `en ${contextName}`}. Les
                données permettent d'obtenir une vision plus fine de la
                distribution par spécialité au sein des groupes CNU.
              </i>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default ResearchTeachers;

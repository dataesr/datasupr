import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
} from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useBreadcrumbItems, useContextDetection } from "../../utils";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";
import ResearchTeachersOverviewTable from "./table/overview";
import YearSelector from "../../components/filters";
import SubtitleWithContext from "./utils/get-title";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";

export function ResearchTeachers() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
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
        <Col>
          <SubtitleWithContext classText="fr-text--lg fr-text--bold fr-mb-0" />
        </Col>
      </Row>

      <Row >
        <Col md={8}>
          {!contextId && (
            <div>
              <ResearchTeachersOverviewTable
                context={context}
                annee_universitaire={selectedYear}
                contextId={contextId}
              />
            </div>
          )}

          {contextId && (
            <>
              <div className="text-center">
                <Title as="h5" look="h6" className="fr-mb-1w">
                  Répartition par groupes CNU
                </Title>
                <CnuGroupsTable
                  context={context}
                  contextId={contextId}
                  annee_universitaire={selectedYear}
                  showAgeDemographics={true}
                />
              </div>
              <div className="text-center fr-mt-4w">
                <Title as="h5" look="h6" className="fr-mb-1w">
                  Répartition par sections CNU
                </Title>
                <CnuSectionsTable
                  context={context}
                  contextId={contextId}
                  annee_universitaire={selectedYear}
                  showDiscipline={false}
                  showGroup={true}
                  showAgeDemographics={true}
                />
              </div>
            </>
          )}
        </Col>

        <Col  md={4} style={{ textAlign: "center" }}>
          <div className="fr-mb-5w">
            <GeneralIndicatorsCard type="research-teachers" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Text,
} from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useBreadcrumbItems, useContextDetection } from "../../utils";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";
import ResearchTeachersOverviewTable from "./table/overview";
import YearSelector from "../../components/filters";
import SubtitleWithContext from "./utils/get-title";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { CnuAgeDistribution } from "./charts/age/pyra";
import { CategoryDistribution } from "./charts/categories/categories";

export function ResearchTeachers() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId, contextName } = useContextDetection();
  const breadcrumbItems = useBreadcrumbItems(context, contextId, contextName);

  return (
    <Container as="main">
      <Row gutters>
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
      <Title
        as="h3"
        look="h6"
        className="fr-mt-2w fr-mb-3w"
        style={{
          backgroundColor: "var(--background-alt-blue-france)",
          padding: "1.0rem 0.5rem 0.1rem 0.5rem",
          borderLeft: "6px solid var(--blue-france-main-525)",
        }}
      >
        Les enseignants-chercheurs
        <i>
          <SubtitleWithContext classText="" />
        </i>
      </Title>
      <Row gutters className="fr-mt-3w">
        <Col>
          <Text>
            Un enseignant-chercheur est un enseignant titulaire qui partage
            statutairement son activité entre l'enseignement supérieur et la
            recherche scientifique et qui exerce cette activité au sein d'un
            établissement d'enseignement supérieur[1]. Il peut également se voir
            confier des charges administratives pour lesquelles il peut
            percevoir une prime pour charges administratives. Ces tâches
            administratives ne sont pas assimilables à un travail administratif
            effectué par d'autres personnels[2]. À l'exception des
            enseignants-chercheurs associés, il s'agit de fonctionnaires. Bien
            qu'il existe plusieurs corps d'enseignants-chercheurs, l'expression
            désigne principalement les enseignants-chercheurs relevant du
            ministre chargé de l'enseignement supérieur et du décret statutaire
            no 84-431 du 6 juin 1984[3] qui sont de loin les plus nombreux. À la
            rentrée 2012, ils sont 56 000 à enseigner dans les établissements
            publics sous tutelle du Ministère chargé de l'Enseignement
            supérieur[4]. L'expression est également utilisée dans
            l'enseignement supérieur privé afin de désigner les enseignants
            titulaires d'un doctorat ou de l'habilitation à diriger des
            recherches effectuant une activité de recherche au sein de leur
            institution.
          </Text>
        </Col>
      </Row>
      <Row gutters className="fr-mt-4w">
        <Col md={4}>
          <div
            className="fr-background-alt--blue-france fr-p-3w"
            style={{ height: "100%" }}
          >
            <GeneralIndicatorsCard type="research-teachers" />
          </div>
        </Col>
        <Col md={8}>
          <div
            className="fr-background-alt--blue-france fr-p-3w"
            style={{ height: "100%" }}
          >
            <CategoryDistribution />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="fr-mt-4w">
          <div
            className="fr-background-alt--blue-france fr-p-3w"
            style={{ height: "100%" }}
          >
            <CnuAgeDistribution />
          </div>
        </Col>
      </Row>
      <Row gutters className="fr-mt-4w">
        <Col md={12}>
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
            </>
          )}
        </Col>
      </Row>
      {contextId && (
        <Row gutters className="fr-mt-4w">
          <Col>
            <Title as="h5" look="h6" className="fr-mb-1w">
              Répartition par sections CNU
            </Title>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <CnuSectionsTable
                context={context}
                contextId={contextId}
                annee_universitaire={selectedYear}
                showDiscipline={false}
                showGroup={true}
                showAgeDemographics={true}
              />
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

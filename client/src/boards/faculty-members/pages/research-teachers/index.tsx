import { Container, Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";
import ResearchTeachersOverviewTable from "./table/overview";
import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { CnuAgeDistribution } from "./charts/age/pyra";
import { CategoryDistribution } from "./charts/categories/categories";
import { CategoryEvolutionChart } from "./charts/categories-evolution/evolution";
import { GlossaryTerm } from "../glossary/glossary-tooltip";

export function ResearchTeachers() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();

  return (
    <Container as="main">
      <Row gutters className="fr-mt-3w">
        <Col>
          <Text>
            Un <GlossaryTerm term="enseignant-chercheur" /> est un{" "}
            <GlossaryTerm term="personnel enseignant">
              enseignant titulaire
            </GlossaryTerm>{" "}
            qui partage statutairement son activité entre{" "}
            <GlossaryTerm term="enseignement supérieur" /> et la recherche
            scientifique et qui exerce cette activité au sein d'un
            <GlossaryTerm term="établissement d'enseignement supérieur">
              établissement d'enseignement supérieur
            </GlossaryTerm>
            . Il peut également se voir confier des charges administratives pour
            lesquelles il peut percevoir une prime pour charges administratives.
            Ces tâches administratives ne sont pas assimilables à un travail
            administratif effectué par d'autres personnels. À l'exception des
            enseignants-chercheurs associés, il s'agit de fonctionnaires. Bien
            qu'il existe plusieurs corps d'
            <GlossaryTerm term="enseignant-chercheur" />, l'expression désigne
            principalement les enseignants-chercheurs relevant du ministre
            chargé de l'
            <GlossaryTerm term="enseignement supérieur" /> et du décret
            statutaire no 84-431 du 6 juin 1984 qui sont de loin les plus
            nombreux. À la rentrée 2012, ils sont 56 000 à enseigner dans les
            établissements publics sous tutelle du Ministère chargé de
            l'Enseignement supérieur. L'expression est également utilisée dans
            l'enseignement supérieur privé afin de désigner les enseignants
            titulaires d'un doctorat ou de l'habilitation à diriger des
            recherches effectuant une activité de recherche au sein de leur
            institution.
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <CategoryEvolutionChart />
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
                showAgeDemographics={true}
              />
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

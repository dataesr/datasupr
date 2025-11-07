import { Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";
import ResearchTeachersOverviewTable from "./table/overview";
// import GeneralIndicatorsCard from "../../components/general-indicators-card/general-indicators-card";
import { AgeDistribution } from "./charts/age/pyra";
import { CategoryDistribution } from "./charts/categories/categories";
import { CategoryEvolutionChart } from "./charts/categories-evolution/evolution";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import NavigationInfo from "../../components/navigation-info";
import { getLabels } from "../../components/navigation-utils";
import { useFacultyMembersResearchTeachers } from "../../api/use-research-teachers";
import { useMemo } from "react";
import Callout from "../../../../components/callout";
import "../styles.scss";

export function ResearchTeachers() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId, contextName } = useContextDetection();
  const labels = getLabels(context);

  const { data: researchTeachersData } = useFacultyMembersResearchTeachers({
    context,
    annee_universitaire: selectedYear,
    contextId,
  });

  const totalTeachers = useMemo(() => {
    if (!researchTeachersData?.cnuGroups) return 0;
    return researchTeachersData.cnuGroups.reduce(
      (sum, group) => sum + (group.totalCount || 0),
      0
    );
  }, [researchTeachersData]);

  const isAcademie = contextId?.toString().startsWith("A");

  return (
    <>
      <Row className="fr-mt-4w fr-mb-5w">
        <Col md={12}>
          <Callout>
            <Text size="sm">
              Un <GlossaryTerm term="enseignant-chercheur" /> est un{" "}
              <GlossaryTerm term="personnel enseignant">
                enseignant titulaire
              </GlossaryTerm>{" "}
              qui partage statutairement son activité entre{" "}
              <GlossaryTerm term="enseignement supérieur" /> et la{" "}
              <GlossaryTerm term="recherche scientifique">
                recherche scientifique
              </GlossaryTerm>{" "}
              et qui exerce cette activité au sein d'un{" "}
              <GlossaryTerm term="établissement d'enseignement supérieur">
                établissement d'enseignement supérieur
              </GlossaryTerm>
              . Il peut également se voir confier des{" "}
              <GlossaryTerm term="charges administratives">
                charges administratives
              </GlossaryTerm>{" "}
              pour lesquelles il peut percevoir une prime pour charges
              administratives. Ces tâches administratives ne sont pas
              assimilables à un travail administratif effectué par d'autres
              personnels. À l'exception des enseignants-chercheurs associés, il
              s'agit de{" "}
              <GlossaryTerm term="fonctionnaire">fonctionnaires</GlossaryTerm>.
              Bien qu'il existe plusieurs{" "}
              <GlossaryTerm term="corps d'enseignant-chercheur">
                corps d'enseignant chercheur
              </GlossaryTerm>
              , l'expression désigne principalement les enseignants-chercheurs
              relevant du ministre chargé de l'enseignement supérieur et du
              décret statutaire no 84-431 du 6 juin 1984 qui sont de loin les
              plus nombreux.{" "}
              {selectedYear && totalTeachers > 0 && (
                <>
                  À la rentrée {selectedYear}, ils sont{" "}
                  {totalTeachers.toLocaleString()} à enseigner
                  {contextId && contextName && context !== "geo" && (
                    <>
                      {" "}
                      en{" "}
                      {context === "fields"
                        ? "discipline"
                        : "dans l'établissement"}{" "}
                      <strong>{contextName}</strong>
                    </>
                  )}
                  {contextId && contextName && context === "geo" && (
                    <>
                      {" "}
                      dans {isAcademie ? "l" : "la"}{" "}
                      <strong>{contextName}</strong>
                    </>
                  )}{" "}
                  dans les établissements publics sous tutelle du Ministère
                  chargé de l'Enseignement supérieur.{" "}
                </>
              )}
              L'expression est également utilisée dans l'enseignement supérieur
              privé afin de désigner les enseignants titulaires d'un{" "}
              <GlossaryTerm term="doctorat">doctorat</GlossaryTerm> ou de l'
              <GlossaryTerm term="habilitation à diriger des recherches">
                habilitation à diriger des recherches
              </GlossaryTerm>{" "}
              effectuant une activité de recherche au sein de leur institution.
            </Text>
          </Callout>
        </Col>
      </Row>

      {/* <Row className="fr-mb-4w">
        <Col xs={12}>
          <div
            style={{
              background: "white",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          >
            <GeneralIndicatorsCard type="research-teachers" />
          </div>
        </Col>
      </Row> */}

      <Row className="fr-mb-6w">
        <Col xs={12}>
          <div className="chartSection">
            <CategoryDistribution />
          </div>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col xs={12}>
          <div className="chartSection">
            <AgeDistribution />
          </div>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col xs={12}>
          <div className="chartSection">
            <CategoryEvolutionChart />
          </div>
        </Col>
      </Row>

      <Row className="fr-mb-3w">
        <Col md={12}>
          <Title as="h2" look="h4" className="sectionTitle">
            {!contextId
              ? "📋 Vue d'ensemble par "
              : "🎓 Répartition par groupes CNU"}
            {!contextId &&
              (context === "fields"
                ? "discipline"
                : context === "structures"
                ? "établissement"
                : "région")}
          </Title>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col md={12}>
          {!contextId && (
            <div className="chartSection">
              <ResearchTeachersOverviewTable
                context={context}
                annee_universitaire={selectedYear}
                contextId={contextId}
              />
            </div>
          )}

          {contextId && (
            <div className="chartSection">
              <CnuGroupsTable
                context={context}
                contextId={contextId}
                annee_universitaire={selectedYear}
                showAgeDemographics={true}
              />
            </div>
          )}
        </Col>
      </Row>

      {contextId && (
        <>
          <Row className="fr-mb-3w">
            <Col md={12}>
              <Title as="h2" look="h4" className="sectionTitle">
                🔬 Répartition par sections CNU
              </Title>
            </Col>
          </Row>

          <Row className="fr-mb-6w">
            <Col xs={12}>
              <div className="chartSection">
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <CnuSectionsTable
                    context={context}
                    contextId={contextId}
                    annee_universitaire={selectedYear}
                    showDiscipline={false}
                    showAgeDemographics={true}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}

      {/* Section Navigation */}
      {contextId && (
        <NavigationInfo urlPath={labels.urlPath} plural={labels.plural} />
      )}
    </>
  );
}

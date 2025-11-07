import { Row, Col, Title, Text } from "@dataesr/dsfr-plus";
import { GenderDataCard } from "./components/gender-info";
import { GroupCNUTreemapChart } from "./charts/group-cnu-treemap/group-cnu-treemap";
import ItemsTreemapChart from "./charts/fields-treemap/fields-treemap";
import ItemBarChart from "./charts/fields-bar/fields-bar";
import SectionsBubbleChart from "./charts/section-cnu-bubble/section-cnu-bubble";
import { useContextDetection } from "../../utils";
import NavigationInfo from "../../components/navigation-info";
import { useContextParams, getLabels } from "../../components/navigation-utils";
import Callout from "../../../../components/callout";
import { GlossaryTerm } from "../../components/glossary/glossary-tooltip";
import "../styles.scss";

export function Typologie() {
  const { context, contextId } = useContextDetection();

  const labels = getLabels(context);

  const { groupId } = useContextParams();

  return (
    <>
      <Row className="fr-mt-4w">
        <Col md={12}>
          <Callout className="callout-style-fields">
            <Text size="sm">
              Cette page présente une analyse de la parité entre les{" "}
              <GlossaryTerm term="personnel enseignant">
                personnels enseignants
              </GlossaryTerm>{" "}
              femmes et hommes à travers différentes disciplines et sections
              CNU. Les visualisations permettent d'identifier les déséquilibres
              de genre et d'observer les tendances de représentation dans
              l'enseignement supérieur.
            </Text>
          </Callout>
        </Col>
      </Row>

      <Row className="fr-mb-6w">
        <Col md={12}>
          <Title as="h2" look="h4" className="sectionTitle fr-mb-1w">
            👥 Répartition par genre
          </Title>
        </Col>
      </Row>

      <Row gutters className="fr-mb-6w">
        <Col md={6}>
          <div className="genderSection">
            <GenderDataCard gender="femmes" />
          </div>
        </Col>
        <Col md={6}>
          <div className="genderSection">
            <GenderDataCard gender="hommes" />
          </div>
        </Col>
      </Row>

      {!contextId && (
        <>
          <Row className="fr-mb-3w">
            <Col md={12}>
              <Title as="h2" look="h4" className="sectionTitle">
                📊 Distribution par disciplines
              </Title>
            </Col>
          </Row>

          <Row className="fr-mb-6w">
            <Col md={12}>
              <div className="chartSection">
                <ItemBarChart />
              </div>
            </Col>
          </Row>

          <Row className="fr-mb-6w">
            <Col md={12}>
              <div className="chartSection">
                <ItemsTreemapChart />
              </div>
            </Col>
          </Row>
        </>
      )}

      {contextId && !groupId && (
        <>
          <Row className="fr-mb-3w">
            <Col md={12}>
              <Title as="h2" look="h4" className="sectionTitle">
                🎓 Analyse des groupes CNU
              </Title>
            </Col>
          </Row>

          <Row className="fr-mb-6w">
            <Col md={12}>
              <div className="chartSection">
                <GroupCNUTreemapChart />
                <div className="fr-mt-4w">
                  <SectionsBubbleChart />
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}

      {contextId && groupId && (
        <>
          <Row className="fr-mb-3w">
            <Col md={12}>
              <Title as="h2" look="h4" className="sectionTitle">
                🔬 Sections CNU
              </Title>
            </Col>
          </Row>

          <Row className="fr-mb-6w">
            <Col md={12}>
              <div className="chartSection">
                <SectionsBubbleChart />
              </div>
            </Col>
          </Row>
        </>
      )}

      {contextId && (
        <NavigationInfo urlPath={labels.urlPath} plural={labels.plural} />
      )}
    </>
  );
}

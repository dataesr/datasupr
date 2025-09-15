import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { Link } from "@dataesr/dsfr-plus";
import { GenderDataCard } from "./components/gender-info";
import { GroupCNUTreemapChart } from "./charts/group-cnu-treemap/group-cnu-treemap";
import ItemsTreemapChart from "./charts/fields-treemap/fields-treemap";
import ItemBarChart from "./charts/fields-bar/fields-bar";
import SectionsBubbleChart from "./charts/section-cnu-bubble/section-cnu-bubble";
import { useContextDetection } from "../../utils";

export function Typologie() {
  const [searchParams] = useSearchParams();
  const { context, contextId } = useContextDetection();

  const getLabels = () => {
    const labels = {
      fields: {
        singular: "discipline",
        plural: "disciplines",
        groupSingular: "groupe CNU",
        groupPlural: "groupes CNU",
        sectionSingular: "section CNU",
        sectionPlural: "sections CNU",
        urlPath: "discipline",
        viewPath: "vue-disciplinaire",
      },
      geo: {
        singular: "région",
        plural: "régions",
        groupSingular: "département",
        groupPlural: "départements",
        sectionSingular: "section",
        sectionPlural: "sections",
        urlPath: "geo",
        viewPath: "vue-géographique",
      },
      structures: {
        singular: "établissement",
        plural: "établissements",
        groupSingular: "composante",
        groupPlural: "composantes",
        sectionSingular: "sous-section",
        sectionPlural: "sous-sections",
        urlPath: "universite",
        viewPath: "vue-par-établissement",
      },
    };
    return labels[context];
  };

  const labels = getLabels();

  const getContextParams = () => {
    switch (context) {
      case "fields":
        return {
          contextId: searchParams.get("field_id"),
          groupId: searchParams.get("group_id"),
        };
      case "geo":
        return {
          contextId: searchParams.get("geo_id"),
          groupId: searchParams.get("department_id"),
        };
      case "structures":
        return {
          contextId: searchParams.get("structure_id"),
          groupId: searchParams.get("component_id"),
        };
      default:
        return {
          contextId: null,
          groupId: null,
        };
    }
  };

  const { groupId } = getContextParams();

  return (
    <Container as="main">
      <Row gutters className="fr-mb-4w">
        <Col md={6}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <div className="chart-container">
              <GenderDataCard gender="hommes" />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="fr-background-alt--blue-france fr-p-3w">
            <div className="chart-container">
              <GenderDataCard gender="femmes" />
            </div>
          </div>
        </Col>
      </Row>

      {!contextId && (
        <div className="fr-background-alt--blue-france fr-p-3w">
          <Col md={12}>
            <ItemBarChart />
          </Col>
        </div>
      )}

      {!contextId && (
        <div className="fr-background-alt--blue-france fr-p-3w">
          <Col md={12}>
            <ItemsTreemapChart />
          </Col>
        </div>
      )}

      {contextId && !groupId && (
        <div className="fr-background-alt--blue-france fr-p-3w">
          <GroupCNUTreemapChart />
          <Col md={12}>
            <SectionsBubbleChart />
          </Col>
        </div>
      )}

      {contextId && groupId && (
        <Col md={12}>
          <SectionsBubbleChart />
        </Col>
      )}

      {contextId && (
        <>
          <div className="fr-alert fr-alert--info fr-mb-4w">
            <div className="fr-alert__title">Navigation</div>
            <div>
              <Link
                href={`/personnel-enseignant/${labels.urlPath}/vue-d'ensemble`}
              >
                ← Retour à la vue d'ensemble des {labels.plural}
              </Link>
            </div>
            {!groupId && (
              <div className="fr-mt-2w">
                Cliquez sur un {labels.groupSingular} dans le graphique
                ci-dessus pour explorer ses {labels.sectionPlural} en détail.
              </div>
            )}
          </div>
        </>
      )}
    </Container>
  );
}

import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { GenderDataCard } from "./components/gender-info";
import { GroupCNUTreemapChart } from "./charts/group-cnu-treemap/group-cnu-treemap";
import ItemsTreemapChart from "./charts/fields-treemap/fields-treemap";
import ItemBarChart from "./charts/fields-bar/fields-bar";
import SectionsBubbleChart from "./charts/section-cnu-bubble/section-cnu-bubble";
import { useContextDetection } from "../../utils";
import NavigationInfo from "../../components/navigation-info";
import { useContextParams, getLabels } from "../../components/navigation-utils";

export function Typologie() {
  const { context, contextId } = useContextDetection();

  const labels = getLabels(context);

  const { groupId } = useContextParams();

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
        <NavigationInfo urlPath={labels.urlPath} plural={labels.plural} />
      )}
    </Container>
  );
}

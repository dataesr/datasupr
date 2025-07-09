import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Notice,
} from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { Link } from "@dataesr/dsfr-plus";
import { GenderDataCard } from "./components/gender-info";
import { GroupCNUTreemapChart } from "./charts/group-cnu-treemap/group-cnu-treemap";
import ItemsTreemapChart from "./charts/fields-treemap/fields-treemap";
import ItemBarChart from "./charts/fields-bar/fields-bar";
import SectionsBubbleChart from "./charts/section-cnu-bubble/section-cnu-bubble";
import { useBreadcrumbItems, useContextDetection } from "../../utils";
import YearSelector from "../../components/filters";
import SubtitleWithContext from "./utils/subtitle-with-context";

export function Typologie() {
  const [searchParams] = useSearchParams();
  const { context, contextId, contextName } = useContextDetection();

  function capitalize(word: string) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
  }

  const contextNameCapital = capitalize(contextName);

  const breadcrumbItems = useBreadcrumbItems(
    context,
    contextId,
    contextNameCapital
  );

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
      <Row className="fr-my-3w">
        <Col md={12}>
          <Notice closeMode={"disallow"} type={"warning"}>
            Les données des personnels enseignants non permanents ne sont pas
            prises en compte pour l'année car elles ne sont pas disponibles.
          </Notice>
        </Col>
      </Row>

      <Title as="h1" look="h3" className="fr-mt-2w fr-mb-3w">
        La typologie du personnel enseignant par {contextName}
        <i>
          <SubtitleWithContext classText="fr-text--lead" />
        </i>
      </Title>

      <Row gutters className="fr-mb-4w">
        <Col md={6}>
          <GenderDataCard gender="hommes" />
        </Col>
        <Col md={6}>
          <GenderDataCard gender="femmes" />
        </Col>
      </Row>

      {!contextId && (
        <>
          <Col md={12}>
            <ItemBarChart />
          </Col>

          <Col md={12}>
            <ItemsTreemapChart />
          </Col>
        </>
      )}

      {contextId && !groupId && (
        <>
          <GroupCNUTreemapChart />
          <Col md={12}>
            <Title as="h2" look="h4" className="fr-mb-3w">
              {labels.sectionPlural.charAt(0).toUpperCase() +
                labels.sectionPlural.slice(1)}{" "}
              - {contextName}
            </Title>
            <SectionsBubbleChart />
          </Col>
        </>
      )}

      {contextId && groupId && (
        <Col md={12}>
          <Title as="h2" look="h4" className="fr-mb-3w">
            {labels.sectionPlural.charAt(0).toUpperCase() +
              labels.sectionPlural.slice(1)}{" "}
            du {labels.groupSingular}
          </Title>
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

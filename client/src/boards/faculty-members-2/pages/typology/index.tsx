import { Container, Row, Col, Title, Breadcrumb } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { Link } from "@dataesr/dsfr-plus";
import { GenderDataCard } from "./components/gender-info";
import YearSelector from "../../../faculty-members/filters";
import { GroupCNUTreemapChart } from "./charts/group-cnu-treemap/group-cnu-treemap";
import ItemsTreemapChart from "./charts/fields-treemap/fields-treemap";
import ItemBarChart from "./charts/fields-bar/fields-bar";
import SectionsBubbleChart from "./charts/section-cnu-bubble/section-cnu-bubble";
import { useContextDetection } from "../../utils";

export function Typologie() {
  const [searchParams] = useSearchParams();
  const { context, contextId, contextName } = useContextDetection();

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

  const getPageTitle = () => {
    if (contextId) {
      return `Typologie de ${labels.singular} - ${contextName || ""}`;
    }
    return `Typologie du personnel enseignant par ${labels.singular}`;
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        href: "/personnel-enseignant",
        label: "Personnel enseignant",
      },
      {
        href: `/personnel-enseignant/${labels.urlPath}/vue-d'ensemble/`,
        label:
          labels.viewPath.charAt(0).toUpperCase() + labels.viewPath.slice(1),
      },
      {
        label: "Typologie",
        current: true,
      },
    ];
    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

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
          <Breadcrumb className="fr-m-0 fr-pt-3w">
            {breadcrumbItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                {...(item.current && { "aria-current": "page" })}
              >
                {item.current ? <strong>{item.label}</strong> : item.label}
              </Link>
            ))}
          </Breadcrumb>
        </Col>
        <Col md={3} style={{ textAlign: "right" }}>
          <YearSelector />
        </Col>
      </Row>

      <Row className="fr-mt-3w">
        <Col md={12}>
          <Title as="h1" look="h3" className="fr-mt-2w">
            {getPageTitle()}
          </Title>
          <div className="fr-text--xs fr-text--mention-grey fr-mb-3w">
            Année universitaire
            {contextId && (
              <span className="fr-ml-2w fr-badge fr-badge--blue-ecume">
                {labels.singular.charAt(0).toUpperCase() +
                  labels.singular.slice(1)}{" "}
                sélectionnée
              </span>
            )}
          </div>
        </Col>
      </Row>

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
          <Row gutters className="fr-mb-4w">
            <Col md={12}>
              <Title as="h2" look="h4" className="fr-mb-2w">
                Répartition par {labels.singular}
              </Title>
              <ItemBarChart />
            </Col>
          </Row>

          <Row gutters className="fr-mb-4w">
            <Col md={12}>
              <ItemsTreemapChart />
            </Col>
          </Row>
        </>
      )}

      {contextId && !groupId && (
        <>
          <Row gutters className="fr-mb-4w">
            <Col md={12}>
              <Title as="h2" look="h4" className="fr-mb-2w">
                {labels.groupPlural.charAt(0).toUpperCase() +
                  labels.groupPlural.slice(1)}{" "}
                - {contextName}
              </Title>
              <GroupCNUTreemapChart />
            </Col>
          </Row>

          <Row gutters className="fr-mb-4w">
            <Col md={12}>
              <Title as="h2" look="h4" className="fr-mb-2w">
                {labels.sectionPlural.charAt(0).toUpperCase() +
                  labels.sectionPlural.slice(1)}{" "}
                - {contextName}
              </Title>
              <SectionsBubbleChart />
            </Col>
          </Row>
        </>
      )}

      {contextId && groupId && (
        <Row gutters className="fr-mb-4w">
          <Col md={12}>
            <Title as="h2" look="h4" className="fr-mb-2w">
              {labels.sectionPlural.charAt(0).toUpperCase() +
                labels.sectionPlural.slice(1)}{" "}
              du {labels.groupSingular}
            </Title>
            <SectionsBubbleChart />
          </Col>
        </Row>
      )}

      {contextId && (
        <Row className="fr-mt-4w">
          <Col md={12}>
            <div className="fr-alert fr-alert--info fr-alert--sm">
              <h3 className="fr-alert__title">Navigation</h3>
              <p>
                <Link
                  href={`/personnel-enseignant/${labels.urlPath}/vue-d'ensemble`}
                >
                  ← Retour à la vue d'ensemble des {labels.plural}
                </Link>
              </p>
              {!groupId && (
                <p className="fr-mb-0">
                  Cliquez sur un {labels.groupSingular} dans le graphique
                  ci-dessus pour explorer ses {labels.sectionPlural} en détail.
                </p>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

import { useSearchParams } from "react-router-dom";
// import { ContentType } from "../../utils/displayRules";
import PillarsFunding from "../../../overview/components/pillars-funding";
import ProgramsFunding from "../../../overview/components/programs-funding";
import { Container, Row, Col, Title } from "@dataesr/dsfr-plus";
import TopicsFunding from "../../../overview/components/topics-funding";
import DestinationsFunding from "../../../overview/components/destinations-funding";
import PillarsOverview from "../../../overview/components/pillars-overview";
import ProgramsOverview from "../../../overview/components/programs-overview";
import ThematicsOverview from "../../../overview/components/destinations-overview";
import DestinationsOverview from "../../../overview/components/destinations-overview";
import MainPartners from "../../../overview/charts/main-partners";
import SynthesisFocus from "../../../overview/charts/synthesis-focus";
import Callout from "../../../../../../components/callout";
import PillarsFundingEvo3Years from "../../../overview/charts/pillars-funding-evo-3-years";
import BoardsSuggestComponent from "../../../../../../components/boards-suggest-component";
import { getI18nLabel } from "../../../../../../utils";
// import DestinationsFunding from "../../../overview/components/destinations-funding";

const i18n = {
  "pillar-comparison-title": { fr: "Comparaison de la répartition des subventions par pilier", en: "Comparison of grant distribution by pillar" },
  "pillar-detail-title": { fr: "Détails du pilier sur les 3 dernières années", en: "Pillar details over the last 3 years" },
  "pillar-detail-callout": {
    fr: "Visualisez l'évolution des subventions demandées et obtenues pour le pilier sélectionné sur les trois dernières années du programme Horizon Europe. Cela vous permet d'analyser les tendances de financement et d'évaluer la performance du pilier au fil du temps. Vous pouvez également ajuster l'affichage pour visualister le total des subventions, le nombre total de coordinations ou le nombre total de participations.",
    en: "Visualize the evolution of requested and obtained grants for the selected pillar over the last three years of the Horizon Europe program. This allows you to analyze funding trends and evaluate the pillar's performance over time. You can also adjust the display to view total grants, total coordinations, or total participations.",
  },
  "pillar-composition": { fr: "Composition du pilier", en: "Pillar composition" },
  "pillar-composition-callout": {
    fr: "Visualisez la répartition des subventions du pilier sélectionné par programme. Cela vous permet d'identifier les programmes les plus financés et de comprendre leur contribution au sein du pilier.",
    en: "Visualize the grant distribution of the selected pillar by program. This allows you to identify the most funded programs and understand their contribution within the pillar.",
  },
  "grant-distribution-by-program": { fr: "Répartition des subventions par programme", en: "Grant distribution by program" },
  "main-beneficiaries": { fr: "Principaux bénéficiaires", en: "Main beneficiaries" },
  "program-composition": { fr: "Composition du programme", en: "Program composition" },
  "program-composition-callout": {
    fr: "Visualisez la répartition des subventions du programme sélectionné par thématique. Cela vous permet d'identifier les thématiques les plus financées et de comprendre leur contribution au sein du programme.",
    en: "Visualize the grant distribution of the selected program by topic. This allows you to identify the most funded topics and understand their contribution within the program.",
  },
  "grant-distribution-by-topic": { fr: "Répartition des subventions par thématique", en: "Grant distribution by topic" },
  "thematic-composition": { fr: "Composition du ou des thématiques", en: "Thematic composition" },
  "thematic-composition-callout": {
    fr: "Visualisez la répartition des subventions de la ou des thématiques sélectionnée(s) par destination. Cela vous permet d'identifier les destinations les plus financées et de comprendre leur contribution au sein de la ou des thématiques.",
    en: "Visualize the grant distribution of the selected topic(s) by destination. This allows you to identify the most funded destinations and understand their contribution within the topic(s).",
  },
  "grant-distribution-by-destination": { fr: "Répartition des subventions par destination", en: "Grant distribution by destination" },
  "no-content": { fr: "Aucun contenu disponible", en: "No content available" },
};

// export default function SyntheseContent({ contentType }: SyntheseContentProps) {
export default function SyntheseContent() {
  const [searchParams] = useSearchParams();

  const pillarId = searchParams.get("pillarId");
  const programId = searchParams.get("programId");
  const thematicIds = searchParams.get("thematicIds");
  const destinationIds = searchParams.get("destinationIds");
  const currentLang = searchParams.get("language") || "fr";

  let contentType = "pillar-comparison";
  if (pillarId && programId && thematicIds && destinationIds) {
    contentType = "destination-detail";
  } else if (pillarId && programId && thematicIds) {
    contentType = "thematic-detail";
  } else if (pillarId && programId) {
    contentType = "program-detail";
  } else if (pillarId) {
    contentType = "pillar-detail";
  }

  switch (contentType) {
    case "pillar-comparison":
      return (
        <div className="fr-pb-3w">
          <SynthesisFocus />
          <Title as="h2" className="fr-mt-5w">
            {getI18nLabel(i18n, "pillar-comparison-title", currentLang)}
          </Title>
          <PillarsFunding />
          <MainPartners />
        </div>
      );

    case "pillar-detail":
      return (
        <Container fluid className="fr-pb-3w">
          <Row>
            <Col>
              <SynthesisFocus />
            </Col>
          </Row>
          <Row>
            <Col>
              <PillarsOverview />
            </Col>
          </Row>
          <MainPartners />
          <Title as="h2" className="fr-mt-5w">
            {getI18nLabel(i18n, "pillar-detail-title", currentLang)}
          </Title>
          <Callout className="callout-style">{getI18nLabel(i18n, "pillar-detail-callout", currentLang)}</Callout>
          <PillarsFundingEvo3Years />
          <Title as="h2" className="fr-mt-5w">
            {getI18nLabel(i18n, "pillar-composition", currentLang)}
          </Title>
          <Callout className="callout-style">{getI18nLabel(i18n, "pillar-composition-callout", currentLang)}</Callout>
          <Title as="h3">{getI18nLabel(i18n, "grant-distribution-by-program", currentLang)}</Title>
          <ProgramsFunding />
          <BoardsSuggestComponent />
        </Container>
      );

    case "program-detail":
      return (
        <Container fluid className="fr-pb-3w">
          <SynthesisFocus />
          <ProgramsOverview />
          <Title as="h2" className="fr-mt-5w">
            {getI18nLabel(i18n, "main-beneficiaries", currentLang)}
          </Title>
          <MainPartners />
          <Title as="h2" className="fr-mt-5w">
            {getI18nLabel(i18n, "program-composition", currentLang)}
          </Title>
          <Callout className="callout-style">{getI18nLabel(i18n, "program-composition-callout", currentLang)}</Callout>
          <Title as="h3">{getI18nLabel(i18n, "grant-distribution-by-topic", currentLang)}</Title>
          <TopicsFunding />
          <BoardsSuggestComponent />
        </Container>
      );

    case "thematic-detail":
      return (
        <Container fluid className="fr-pb-3w">
          <SynthesisFocus />
          <ThematicsOverview />
          <Title as="h2" className="fr-mt-5w">
            {getI18nLabel(i18n, "main-beneficiaries", currentLang)}
          </Title>
          <MainPartners />
          <Title as="h2" className="fr-mt-5w">
            {getI18nLabel(i18n, "thematic-composition", currentLang)}
          </Title>
          <Callout className="callout-style">{getI18nLabel(i18n, "thematic-composition-callout", currentLang)}</Callout>
          <Title as="h3">{getI18nLabel(i18n, "grant-distribution-by-destination", currentLang)}</Title>
          <DestinationsFunding />
          <BoardsSuggestComponent />
        </Container>
      );

    case "destination-detail":
      return (
        <Container fluid className="fr-pb-3w">
          <SynthesisFocus />
          <DestinationsOverview />
          <Title as="h2" className="fr-mt-5w">
            {getI18nLabel(i18n, "main-beneficiaries", currentLang)}
          </Title>
          <MainPartners />
          <BoardsSuggestComponent />
        </Container>
      );

    default:
      return <div>{getI18nLabel(i18n, "no-content", currentLang)}</div>;
  }
}

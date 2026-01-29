import { ContentType } from "../../utils/displayRules";
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
// import DestinationsFunding from "../../../overview/components/destinations-funding";

interface SyntheseContentProps {
  contentType: ContentType;
}

export default function SyntheseContent({ contentType }: SyntheseContentProps) {
  switch (contentType) {
    case "pillar-comparison":
      return (
        <div>
          <SynthesisFocus />
          <Title as="h2" className="fr-mt-5w">
            Comparaison de la répartition des subventions par pilier
          </Title>
          <PillarsFunding />
          <Title as="h2" className="fr-mt-5w">
            Principaux bénéficiaires
          </Title>
          <MainPartners />
        </div>
      );

    case "pillar-detail":
      return (
        <Container fluid className="fr-pb-3w">
          <Row>
            <Col md={8}>
              <SynthesisFocus />
            </Col>
            <Col className="fr-mt-8w fr-pl-2w">
              <PillarsOverview />
            </Col>
          </Row>
          <Title as="h2" className="fr-mt-5w">
            Principaux bénéficiaires
          </Title>
          <MainPartners />
          <Title as="h2" className="fr-mt-5w">
            Détails du pilier sur les 3 dernières années
          </Title>
          <Callout className="callout-style">
            Visualisez l'évolution des subventions demandées et obtenues pour le pilier sélectionné sur les trois dernières années du programme
            Horizon Europe.
            <br /> Cela vous permet d'analyser les tendances de financement et d'évaluer la performance du pilier au fil du temps.
            <br /> Vous pouvez également ajuster l'affichage pour visualister le total des subventions, le nombre total de coordinations ou le nombre
            total de participations.
          </Callout>
          <PillarsFundingEvo3Years />
          <Title as="h2" className="fr-mt-5w">
            Composition du pilier
          </Title>
          <Callout className="callout-style">
            Visualisez la répartition des subventions du pilier sélectionné par programme.
            <br /> Cela vous permet d'identifier les programmes les plus financés et de comprendre leur contribution au sein du pilier.
          </Callout>
          <Title as="h3">Répartition des subventions par programme</Title>
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
            Principaux bénéficiaires
          </Title>
          <MainPartners />
          <Title as="h2" className="fr-mt-5w">
            Composition du programme
          </Title>
          <Callout className="callout-style">
            Visualisez la répartition des subventions du programme sélectionné par thématique.
            <br /> Cela vous permet d'identifier les thématiques les plus financées et de comprendre leur contribution au sein du programme.
          </Callout>
          <Title as="h3">Répartition des subventions par thématique</Title>
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
            Principaux bénéficiaires
          </Title>
          <MainPartners />
          <Title as="h2" className="fr-mt-5w">
            Composition du ou des thématiques
          </Title>
          <Callout className="callout-style">
            Visualisez la répartition des subventions de la ou des thématiques sélectionnée(s) par destination.
            <br /> Cela vous permet d'identifier les destinations les plus financées et de comprendre leur contribution au sein de la ou des
            thématiques.
          </Callout>
          <Title as="h3">Répartition des subventions par destination</Title>
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
            Principaux bénéficiaires
          </Title>
          <MainPartners />
          <BoardsSuggestComponent />
        </Container>
      );

    default:
      return <div>Aucun contenu disponible</div>;
  }
}

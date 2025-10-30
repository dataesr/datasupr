import { ContentType } from "../../utils/displayRules";
import PillarsFunding from "../../../overview/components/pillars-funding";
import ProgramsFunding from "../../../overview/components/programs-funding";
import { Title } from "@dataesr/dsfr-plus";
import TopicsFunding from "../../../overview/components/topics-funding";
import DestinationsFunding from "../../../overview/components/destinations-funding";
import PillarsOverview from "../../../overview/components/pillars-overview";
import ProgramsOverview from "../../../overview/components/programs-overview";
import ThematicsOverview from "../../../overview/components/destinations-overview";
import DestinationsOverview from "../../../overview/components/destinations-overview";
import MainPartners from "../../../overview/charts/main-partners";
import SynthesisFocus from "../../../overview/charts/synthesis-focus";
import Callout from "../../../../../../components/callout";
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
            Comparaison de la répartition des financements par pilier
          </Title>
          <PillarsFunding />
          <Title as="h2" className="fr-mt-5w">
            Principaux bénéficiaires
          </Title>
          <MainPartners />

          <p>Tableaux de synthèse des financements</p>
        </div>
      );

    case "pillar-detail":
      return (
        <div>
          <SynthesisFocus />
          <PillarsOverview />
          <Title as="h2" className="fr-mt-5w">
            Principaux bénéficiaires
          </Title>
          <MainPartners />
          <Title as="h2" className="fr-mt-5w">
            Composition du pilier
          </Title>
          <Callout className="callout-style">
            Visualisez la répartition des financements du pilier sélectionné par programme.
            <br /> Cela vous permet d'identifier les programmes les plus financés et de comprendre leur contribution au sein du pilier.
          </Callout>
          <Title as="h3">Répartition des financements par programme</Title>
          <ProgramsFunding />
        </div>
      );

    case "program-detail":
      return (
        <div>
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
            Visualisez la répartition des financements du programme sélectionné par thématique.
            <br /> Cela vous permet d'identifier les thématiques les plus financées et de comprendre leur contribution au sein du programme.
          </Callout>
          <Title as="h3">Répartition des financements par thématique</Title>
          <TopicsFunding />
        </div>
      );

    case "thematic-detail":
      return (
        <div>
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
            Visualisez la répartition des financements de la ou des thématiques sélectionnée(s) par destination.
            <br /> Cela vous permet d'identifier les destinations les plus financées et de comprendre leur contribution au sein de la ou des
            thématiques.
          </Callout>
          <Title as="h3">Répartition des financements par destination</Title>
          <DestinationsFunding />
        </div>
      );

    case "destination-detail":
      return (
        <div>
          <SynthesisFocus />
          <DestinationsOverview />
          <Title as="h2" className="fr-mt-5w">
            Principaux bénéficiaires
          </Title>
          <MainPartners />
        </div>
      );

    default:
      return <div>Aucun contenu disponible</div>;
  }
}

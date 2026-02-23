import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Col, Container, Row, Title, Link } from "@dataesr/dsfr-plus";
import PillarCard from "../../components/cards/pillars";
import ErcCard from "../../components/cards/erc";
import MscaCard from "../../components/cards/msca";
import Timeline from "./components/Timeline";
import { getFiltersValues } from "../../api";

import i18n from "./i18n.json";

import "./styles.scss";


export default function Home() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  const { data: dataPillars } = useQuery({
    queryKey: ["ep/get-filters-values", "pillars"],
    queryFn: () => getFiltersValues("pillars"),
  });

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <Container as="section" className="fr-mt-2w">
      <Row className="fr-my-5w ep-bg1" gutters>
        <Col md={8} className="fr-p-1w">
          <Title as="h2" look="h5" className="fr-mb-1w">
            {getI18nLabel("title1")}
          </Title>
          <p
            dangerouslySetInnerHTML={{
              __html: getI18nLabel("bloc1"),
            }}
          />
        </Col>
        <Col className="text-right">
          <Link href="https://ec.europa.eu/programmes/horizon2020/" target="_blank">
            <img
              src="https://commission.europa.eu/themes/contrib/oe_theme/dist/ec/images/logo/positive/logo-ec--fr.svg"
              alt="Lien vers la page officielle du programme Horizon Europe"
              className="fr-mt-1w"
            />
          </Link>
        </Col>
        {dataPillars &&
          dataPillars.map((pillar) => (
            <Col md={6} key={pillar.id}>
              <PillarCard
                description={getI18nLabel(`${pillar.id}-description`)}
                title={pillar[`label_${currentLang}`]}
                subtitle={pillar.id}
                to={`/european-projects/horizon-europe?section=synthesis&pillarId=${pillar.id}`}
              />
            </Col>
          ))}
      </Row>

      <Row className="fr-my-5w ep-bg2" gutters>
        <Col>
          <MscaCard
            title="MSCA"
            subtitle="Actions Marie Sklodowska-Curie"
            description="Le programme européen « Actions Marie Skłodowska-Curie » (MSCA) est le programme de référence de l’Union européenne pour la mobilité, la formation et le développement de la carrière des chercheurs. Au sein du programme-cadre « Horizon Europe », il est intégré au pilier 1 dédié à la science d’excellence."
            to="/european-projects/msca"
          />
        </Col>
        <Col>Grands chiffres MSCA</Col>
      </Row>

      <Row className="fr-my-5w ep-bg3" gutters>
        <Col>Grands chiffres ERC</Col>
        <Col>
          <ErcCard
            title="ERC"
            subtitle="Le Conseil Européen de la Recherche"
            description="L'ERC (European Research Council) finance des projets de recherche exploratoire, aux frontières de la connaissance, dans tous les domaines de la science et de la technologie.
Le seul critère de sélection est celui de l'excellence scientifique."
            to="/european-projects/erc"
          />
        </Col>
      </Row>

      <Row className="fr-mb-5w ep-bg2" gutters>
        <Col md={12}>
          <Timeline />
        </Col>
        <Col md={12} className="text-center">
          <Link href="/european-projects/evolution-pcri" className="fr-link fr-link--icon-right">
            Visualisez et analysez l'évolution des programmes européens de recherche
            <span className="fr-fi-arrow-right-line fr-link__icon fr-link__icon--right" />
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

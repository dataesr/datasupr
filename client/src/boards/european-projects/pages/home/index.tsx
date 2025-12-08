import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getFiltersValues } from "../../api";

import { Col, Container, Row, Title, Modal, ModalContent, ModalTitle, ModalFooter, Link } from "@dataesr/dsfr-plus";
import { useState } from "react"; // Ajoutez cet import
import Timeline from "./components/Timeline";
import i18n from "./i18n.json";
import "./styles.scss";
import PillarCard from "../../components/cards/pillars";
import ErcCard from "../../components/cards/erc";
import MscaCard from "../../components/cards/msca";

interface Program {
  title: string;
  pilier: number;
  description: string;
}
export default function Home() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  // const [activePillar, setActivePillar] = useState(null); // Ajoutez cet état
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram] = useState<Program | null>(null);

  const { data: dataPillars } = useQuery({
    queryKey: ["ep/get-filters-values", "pillars"],
    queryFn: () => getFiltersValues("pillars"),
  });

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  // const handlePillarClick = (pillarNumber) => {
  //   setActivePillar(activePillar === pillarNumber ? null : pillarNumber);
  // };

  // const handleProgramClick = (program) => {
  //   setSelectedProgram(program);
  //   setIsModalOpen(true);
  // };

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
                to={`/european-projects/overview?view=synthesis|program&pillarId=${pillar.id}`}
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
          <Timeline currentLang={currentLang} />
        </Col>
        <Col md={12} className="text-center">
          <Link href="/european-projects/evolution-pcri" className="fr-link fr-link--icon-right">
            Visualisez et analisez l'évolution des programmes européens de recherche
            <span className="fr-fi-arrow-right-line fr-link__icon fr-link__icon--right" />
          </Link>
        </Col>
      </Row>

      <Modal isOpen={isModalOpen} hide={() => setIsModalOpen(false)} size="lg">
        <ModalTitle>{selectedProgram?.title || ""}</ModalTitle>
        <ModalContent>
          {selectedProgram && (
            <div>
              <p>
                <strong>Pilier {selectedProgram.pilier}</strong>
              </p>
              <p>{selectedProgram.description}</p>
            </div>
          )}
        </ModalContent>
        <ModalFooter>
          <Link href="/european-projects/search" className="fr-link fr-link--icon-right">
            <span className="fr-fi-arrow-right-line fr-link__icon fr-link__icon--right" />
            Lien vers la page de sélection des filtres
          </Link>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

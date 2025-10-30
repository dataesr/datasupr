import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getFiltersValues } from "../../api";

import { Col, Container, Row, Title, Modal, ModalContent, ModalTitle, ModalFooter, Link } from "@dataesr/dsfr-plus";
import { useState } from "react"; // Ajoutez cet import
import Timeline from "./components/Timeline";
import i18n from "./i18n.json";
import "./styles.scss";
import PillarCard from "../../components/cards/pillars";

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
                to={`/european-projects/overview?view=program&pillarId=${pillar.id}`}
              />
            </Col>
          ))}
      </Row>

      <Row className="fr-my-5w ep-bg2" gutters>
        <Col>
          <PillarCard
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
          <PillarCard
            title="ERC"
            subtitle="Le Conseil Européen de la Recherche"
            description="L'ERC (European Research Council) finance des projets de recherche exploratoire, aux frontières de la connaissance, dans tous les domaines de la science et de la technologie.
Le seul critère de sélection est celui de l'excellence scientifique."
            to="/european-projects/erc"
          />
        </Col>
      </Row>

      <Row className="fr-mb-5w">
        <Col md={12}>
          <Timeline currentLang={currentLang} />
        </Col>
        <Col md={12} className="text-center">
          <Link href="/european-projects/search" className="fr-link fr-link--icon-right">
            Visualisez et analisez l'évolution des programmes européens de recherche
            <span className="fr-fi-arrow-right-line fr-link__icon fr-link__icon--right" />
          </Link>
        </Col>
      </Row>

      {/* 
      <Row gutters>
        <Col md={12}>
          <p
            dangerouslySetInnerHTML={{
              __html: getI18nLabel("bloc2"),
            }}
          />
        </Col>
        <Col>
          <div className="ep-bg2">chiffre</div>
        </Col>
        <Col>
          <div className="ep-bg2">chiffre</div>
        </Col>
        <Col>
          <div className="ep-bg2">chiffre</div>
        </Col>
        <Col>
          <div className="ep-bg2">chiffre</div>
        </Col>
        <Col>
          <div className="ep-bg2">
            {" "}
            <p
              dangerouslySetInnerHTML={{
                __html: getI18nLabel("bloc3"),
              }}
            />
          </div>
        </Col>
      </Row> */}
      {/* <Row className="fr-my-5w" style={{ minHeight: "200px" }}>
        <Col className="fr-p-1w">
          <Title as="h2" look="h5" className="fr-mb-1w">
            {getI18nLabel("title3")}
          </Title>
          <div className="pillars-container">
            <div className="pillar">
              <Button onClick={() => handlePillarClick(1)} color="green-archipel" size="sm">
                Pilier 1 - Excellence scientifique
              </Button>
              <div className={`programs ${activePillar === 1 ? "active" : ""}`}>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 1,
                      title: "Conseil européen de la recherche (ERC)",
                      description: "Description du programme ERC...",
                    })
                  }
                >
                  Conseil européen de la recherche (ERC)
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 1,
                      title: "Marie Sklodowska-Curie Actions (MSCA)",
                      description: "Description des Marie Sklodowska-Curie Actions (MSCA)",
                    })
                  }
                >
                  Marie Sklodowska-Curie Actions (MSCA)
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 1,
                      title: "Infrastructures de recherche",
                      description: "Description des Infrastructures de recherche",
                    })
                  }
                >
                  Infrastructures de recherche
                </Button>
              </div>
            </div>
            <div className="pillar">
              <Button onClick={() => handlePillarClick(2)} color="green-archipel" size="sm">
                Pilier 2 - Problématiques mondiales et compétitivité industrielle européenne
              </Button>
              <div className={`programs ${activePillar === 2 ? "active" : ""}`}>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      title: "Bio-Environnement",
                      pilier: 2,
                      description: "Description du Bio-Environnement",
                    })
                  }
                >
                  Bio-Environnement
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 2,
                      title: "Climat, énergie et mobilité",
                      description: "Description du Climat, énergie et mobilité",
                    })
                  }
                >
                  Climat, énergie et mobilité
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 2,
                      title: "Culture, créativité et société inclusive",
                      description: "Description de la Culture, créativité et société inclusive",
                    })
                  }
                >
                  Culture, créativité et société inclusive
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 2,
                      title: "Mission",
                      description: "Description de la Mission",
                    })
                  }
                >
                  Mission
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 2,
                      title: "Numérique, industrie et espace",
                      description: "Description du Numérique, industrie et espace",
                    })
                  }
                >
                  Numérique, industrie et espace
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 2,
                      title: "Santé",
                      description: "Description de la Santé",
                    })
                  }
                >
                  Santé
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 2,
                      title: "Sécurité civile pour la société",
                      description: "Description de la Sécurité civile pour la société",
                    })
                  }
                >
                  Sécurité civile pour la société
                </Button>
              </div>
            </div>
            <div className="pillar">
              <Button onClick={() => handlePillarClick(3)} color="green-archipel" size="sm">
                Pilier 3 - Europe plus innovante
              </Button>
              <div className={`programs ${activePillar === 3 ? "active" : ""}`}>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 3,
                      title: "Conseil européen de l'innovation (EIC)",
                      description: "Description du Conseil européen de l'innovation (EIC)",
                    })
                  }
                >
                  Conseil européen de l'innovation (EIC)
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 3,
                      title: "Écosystèmes européens de l'innovation (EIE)",
                      description: "Description des Écosystèmes européens de l'innovation (EIE)",
                    })
                  }
                >
                  Écosystèmes européens de l'innovation (EIE)
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 3,
                      title: "Institut européen d'innovation et de technologie (EIT)",
                      description: "Description de l'Institut européen d'innovation et de technologie (EIT)",
                    })
                  }
                >
                  Institut européen d'innovation et de technologie (EIT)
                </Button>
              </div>
            </div>
            <div className="pillar">
              <Button onClick={() => handlePillarClick(4)} color="green-archipel" size="sm">
                Pilier 4 - Élargir la participation et renforcer l'espace européen de la recherche
              </Button>
              <div className={`programs ${activePillar === 4 ? "active" : ""}`}>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 4,
                      title: "Élargir la participation et diffuser l'excellence",
                      description: "Description de l'Élargir la participation et diffuser l'excellence",
                    })
                  }
                >
                  Élargir la participation et diffuser l'excellence
                </Button>
                <Button
                  color="green-archipel"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleProgramClick({
                      pilier: 4,
                      title: "Réformer et renforcer le système européen de la R&I",
                      description: "Description de la Réformer et renforcer le système européen de la R&I",
                    })
                  }
                >
                  Réformer et renforcer le système européen de la R&I
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row> */}
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

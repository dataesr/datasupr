import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import CardSimple from "../../../../../components/card-simple";

interface Structure {
  etablissement_id_paysage: string;
  etablissement_lib: string;
  etablissement_id_paysage_actuel: string;
  etablissement_actuel_lib: string;
  etablissement_actuel_categorie?: string;
  type: string;
  typologie: string;
  exercice: number;
  date_de_creation?: string;
  date_de_fermeture?: string;
  effectif_sans_cpge?: number;
  anuniv: string;
}

interface MultipleStructureSelectorProps {
  etablissements: Structure[];
  selectedYear: string;
  etablissementActuelLib: string;
}

export default function MultipleStructuresSelector({
  etablissements,
  selectedYear,
  etablissementActuelLib,
}: MultipleStructureSelectorProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelect = (etablissementIdPaysage: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("structureId", etablissementIdPaysage);
    next.set("useHistorical", "true");
    setSearchParams(next);
  };

  return (
    <Container className="fr-py-2w">
      <Row className="fr-mb-4w">
        <Col>
          <div className="fr-notice fr-notice--info">
            <div className="fr-notice__body">
              <p className="fr-notice__desc">
                Pour l'année <strong>{selectedYear}</strong>, l'établissement
                actuel <strong>{etablissementActuelLib}</strong> regroupe{" "}
                <strong>{etablissements.length} établissements</strong> qui
                existaient de manière indépendante. Veuillez choisir celui dont
                vous souhaitez consulter les données.
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutters>
        {etablissements.map((etab) => (
          <Col key={etab.etablissement_id_paysage} xs="12" md="6">
            <CardSimple
              onClick={() => handleSelect(etab.etablissement_id_paysage)}
              stat={etab.effectif_sans_cpge}
              subtitle={etab.etablissement_actuel_categorie}
              title={etab.etablissement_lib}
              year={etab.anuniv}
            />
          </Col>
        ))}
      </Row>

      <Row className="fr-mt-4w">
        <Col>
          <p
            className="fr-text--sm"
            style={{ color: "var(--text-mention-grey)" }}
          >
            <span
              className="fr-icon-information-line fr-icon--sm fr-mr-1v"
              aria-hidden="true"
            ></span>
            Les données affichées correspondront à l'établissement sélectionné
            tel qu'il existait en {selectedYear}.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

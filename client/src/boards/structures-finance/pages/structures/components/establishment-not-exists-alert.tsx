import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import CustomBreadcrumb from "../../../../../components/custom-breadcrumb";
import StructureCard from "../../../../../components/structure-card";
import navigationConfig from "../../../navigation-config.json";

interface EstablishmentNotExistsAlertProps {
  etablissementLibHistorique: string;
  etablissementActuel: {
    etablissement_id_paysage: string;
    etablissement_lib: string;
    etablissement_actuel_lib: string;
  };
  selectedYear: string;
}

export default function EstablishmentNotExistsAlert({
  etablissementLibHistorique,
  etablissementActuel,
  selectedYear,
}: EstablishmentNotExistsAlertProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSwitchToCurrentEstablishment = () => {
    const next = new URLSearchParams(searchParams);
    next.set("structureId", etablissementActuel.etablissement_id_paysage);
    next.delete("useHistorical");
    setSearchParams(next);
  };

  return (
    <main>
      <Container fluid className="etablissement-selector__wrapper">
        <Container as="section">
          <Row>
            <Col>
              <CustomBreadcrumb config={navigationConfig} />
            </Col>
          </Row>
        </Container>
        <Container className="fr-py-6w">
          <Row>
            <Col>
              <div className="fr-alert fr-alert--warning">
                <h3 className="fr-alert__title">
                  Établissement non disponible pour l'année {selectedYear}
                </h3>
                <p>
                  L'établissement <strong>{etablissementLibHistorique}</strong>{" "}
                  n'existe pas pour l'année <strong>{selectedYear}</strong>.
                </p>
              </div>
            </Col>
          </Row>
          <Row className="fr-mt-3w">
            <Col xs="12" md="6">
              <StructureCard
                title={
                  etablissementActuel.etablissement_actuel_lib ||
                  etablissementActuel.etablissement_lib
                }
                onClick={handleSwitchToCurrentEstablishment}
              />
            </Col>
          </Row>
        </Container>
      </Container>
    </main>
  );
}

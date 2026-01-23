import { Alert, Col, Container, Row } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import CustomBreadcrumb from "../../../../components/custom-breadcrumb";
import YearSelector from "../../components/year-selector";
import navigationConfig from "../navigation-config.json";
import ClassificationsByStructures from "./charts/classifications-by-structures";
import Dispersion from "./charts/dispersion";
import ProjectsByStructures from "./charts/projects-by-structures";
import StructuresSelector from "./components/structures-selector";


export default function Comparison() {
  const [searchParams] = useSearchParams({});
  const structures = searchParams.getAll("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");

  return (
    <Container className="board-fundings fr-pt-3w">
      <CustomBreadcrumb config={navigationConfig} />
      <Row gutters>
        <Col>
          <StructuresSelector />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <YearSelector />
        </Col>
      </Row>
      {(Number(yearMin) <= Number(yearMax)) && (
        (structures && structures.length >= 2) ? (
          <>
            <Row gutters>
              <Col>
                <ProjectsByStructures />
              </Col>
            </Row>
            <Row gutters>
              <Col>
                <Dispersion />
              </Col>
            </Row>
            <Row gutters>
              <Col>
                <ClassificationsByStructures />
              </Col>
            </Row>
          </>
        ) : (
          <Alert
            description="Choisissez plusieurs structures dans la liste déroulante pour visualiser
              leurs financements via les appels à projets. Vous pouvez filtrer par région et par typologie."
            className="fr-mt-3w"
            title="Sélectionner plusieurs structures"
            variant="info"
          />
        )
      )}
    </Container>
  )
}
import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import YearSelector from "../../components/year-selector";
import Dispersion from "./charts/dispersion";
import ProjectsByStructures from "./charts/projects-by-structures";
import StructuresSelector from "./components/structures-selector";


export default function Comparison() {
  const [searchParams] = useSearchParams({});
  const structures = searchParams.getAll("structure");

  return (
    <Container className="board-fundings fr-pt-3w">
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
      {(structures && structures.length > 0) ? (
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
        </>
      ) : (
        <div className="fr-alert fr-alert--info fr-mt-3w">
          <h3 className="fr-alert__title">
            Sélectionner plusieurs structures
          </h3>
          <p>
            Choisissez plusieurs structures dans la liste déroulante pour visualiser
            leurs financements via les appels à projets. Vous pouvez filtrer par région.
          </p>
        </div>
      )}
    </Container>
  )
}
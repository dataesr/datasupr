import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

import YearSelector from "../../components/year-selector";
import ProjectsByStructures from "./charts/projects-by-structures";
// import StructuresSelector from "./components/structures-selector";


export default function Comparison() {
  const [searchParams] = useSearchParams({});
  const year = searchParams.get("year");

  return (
    <Container className="board-fundings">
      {/* <Row gutters>
        <Col>
          <StructuresSelector />
        </Col>
      </Row> */}
      <Row gutters>
        <Col>
          <YearSelector />
        </Col>
      </Row>
      {year && (
        <Row gutters>
          <Col>
            <ProjectsByStructures />
          </Col>
        </Row>
      )}
    </Container>
  )
}
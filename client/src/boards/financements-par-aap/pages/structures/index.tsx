import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import StructureCard from "../../../../components/structure-card";
import { years } from "../../utils";
import StructureSelector from "./components/structure-selector";
import DisplayStructure from "./displayStructure";

import "./styles.scss";


export default function Structures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax") ?? String(years[years.length - 2]);
  const yearMin = searchParams.get("yearMin") ?? String(years[years.length - 2]);
  const [name, setName] = useState("");
  const [structures, setStructures] = useState([]);

  useEffect(() => {
    if (!searchParams.get("section")) {
      searchParams.set("section", "financements");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container className="board-fundings">
      <Row gutters>
        <Col>
          <Title as="h1" look="h4">
            {name}
          </Title>
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <StructureSelector setName={setName} setStructures={setStructures} />
        </Col>
      </Row>
      {(Number(yearMin) <= Number(yearMax)) && (
        structure ? (
          <DisplayStructure />
        ) : (
          <Row gutters>
            {structures.map((structure) => (
              <Col md="4">
                <StructureCard
                  title={structure.label}
                  region={structure.id}
                  // studentCount={studentCount}
                  type={structure.label}
                  year={structure.label}
                  // onClick={() => handleEtablissementSelect(id)}
                />
              </Col>
            ))}
          </Row>
        )
      )}
    </Container >
  );
}

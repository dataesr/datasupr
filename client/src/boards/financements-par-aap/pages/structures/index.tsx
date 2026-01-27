import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CardSimple from "../../../../components/card-simple";
import Breadcrumb from "../../components/breadcrumb";
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

  const handleStructure = (structure) => {
    searchParams.set("structure", structure);
    setSearchParams(searchParams);
  };

  return (
    (Number(yearMin) <= Number(yearMax)) && structure ? (
      <DisplayStructure />
    ) : (
      <Container className="board-fundings">
        <Row gutters>
          <Col>
            <Breadcrumb items={[
              { href: "/financements-par-aap/accueil", label: "Financemnets par AAP" },
              { href: "/financements-par-aap/etablissement", label: "Vue par établissement" },
            ]} />
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <Title as="h1" look="h4">
              Rechercher un établissement
            </Title>
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <StructureSelector setName={setName} setStructures={setStructures} />
          </Col>
        </Row>
        <Row gutters>
          {structures.map((structure: any) => (
            <Col md="4">
              <CardSimple
                description={structure.id}
                onClick={() => handleStructure(structure.id)}
                subtitle={structure.label}
                title={structure.label}
                year={structure.label}
              />
            </Col>
          ))}
        </Row>
      </Container >
    )
  )
};

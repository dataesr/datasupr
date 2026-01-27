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
      <Container className="fr-mb-3w">
        <DisplayStructure />
      </Container>
    ) : (
      <>
        <Container fluid className="funding-gradient">
          <Container>
            <Row gutters>
              <Col>
                <Breadcrumb items={[
                  { href: "/financements-par-aap/accueil", label: "Financements par AAP" },
                  { label: "Vue par établissement" },
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
                <StructureSelector setStructures={setStructures} />
              </Col>
            </Row>
          </Container>
        </Container>
        <Container className="fr-my-3w">
          <Row gutters>
            {structures.map((structure: any) => (
              <Col key={structure.id} md="4">
                <CardSimple
                  description={structure.region}
                  onClick={() => handleStructure(structure.id)}
                  subtitle={structure.typologie_1}
                  title={structure.label}
                  year={structure.label}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </>
    )
  )
};

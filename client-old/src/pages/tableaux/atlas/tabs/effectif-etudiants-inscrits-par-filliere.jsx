import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container, Row, Col,
  // Title,
} from "@dataesr/react-dsfr";
import TitleComponent from "../../../../components/title";

export default function Evolutions() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const structureID = query.get("structureId");
  const countryCode = query.get("countryCode");
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    async function getData() {
      let url = "/api/atlas"
      if (countryCode) {
        url += `?countryCode=${countryCode}`
      }
      const response = await fetch(url);
      const data = await response.json();
      setGraphData(data);
    }

    getData(countryCode);
  }, [])

  return (
    <Container as="section">
      <Row>
        <Col>
          <TitleComponent
            title="effectif-etudiants-inscrits-par-filliere"
            subTitle="..."
          />
        </Col>
      </Row>
      {/* {
        data && data["evol_all_pc_funding_SIGNED"] && data["evol_all_pc_funding_SIGNED"].length > 0 && (
          <Row>
            <Col>
              <Title as="h4">
                Principaux pays bénéficiaires
              </Title>
              <EvolutionFunding
                data={data["evol_all_pc_funding_SIGNED"]}
                title="Evolution annuelle des parts captées"
              />
            </Col>
          </Row>
        )
      } */}


    </Container>
  );
}

Evolutions.propTypes = {
  data: PropTypes.array,
};
Evolutions.defaultProps = {
  data: [],
};
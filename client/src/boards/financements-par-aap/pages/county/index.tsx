import { Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Breadcrumb from "../../components/breadcrumb";
import CardSimple from "../../components/card-simple";
import { getEsQuery } from "../../utils.ts";
import DisplayCounty from "./displayCounty";

import "./styles.scss";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;


export default function Counties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const county = searchParams.get("region");
  const [counties, setCounties] = useState([]);

  const handleCounty = (county) => {
    searchParams.set("region", county);
    setSearchParams(searchParams);
  };

  const body: any = {
    ...getEsQuery({}),
    aggregations: {
      by_county: {
        terms: {
          field: "participant_region.keyword",
          size: 1500,
        },
      },
    },
  };

  const { data } = useQuery({
    queryKey: ["fundings-counties"],
    queryFn: () =>
      fetch(
        `${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`,
        {
          body: JSON.stringify(body),
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      ).then((response) => response.json()),
  });

  useEffect(() => {
    setCounties(data?.aggregations?.by_county?.buckets ?? [])
  }, [data])

  useEffect(() => {
    if (!searchParams.get("section")) {
      searchParams.set("section", "apercu");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    county ? (
      <DisplayCounty />
    ) : (
      <main>
        <Container fluid className="funding-gradient fr-mb-3w">
          <Container as="section">
            <Row gutters>
              <Col>
                <Breadcrumb items={[
                  { href: "/financements-par-aap/accueil", label: "Financements par AAP" },
                  { label: "Vue par région" },
                ]} />
              </Col>
            </Row>
            <Row gutters>
              <Col>
                <Title as="h1" look="h4">
                  Rechercher une région
                </Title>
              </Col>
            </Row>
          </Container>
        </Container>
        <Container className="fr-mb-3w">
          <Row gutters>
            <Text className="fr-text--sm fr-mb-2w fr-pl-2w">
              {counties.length} région
              {counties.length > 1 ? "s" : ""} trouvée
              {counties.length > 1 ? "s" : ""}
            </Text>
          </Row>
          <Row gutters>
            {counties.map((county: any) => (
              <Col key={county.key} xs="12" md="6" lg="4">
                <CardSimple
                  description={`${county.doc_count} participations`}
                  onClick={() => handleCounty(county.key)}
                  title={county.key}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    )
  )
};

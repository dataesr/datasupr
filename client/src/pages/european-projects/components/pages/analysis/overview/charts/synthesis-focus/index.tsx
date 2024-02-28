import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";

import { getDefaultParams } from "./utils";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { getConfig } from "../../../../../../utils";

function Tile({ value, description }: { value: string, description: string }) {
  return (
    <div className="fr-tile fr-tile--sm fr-enlarge-link">
      <div className="fr-tile__body">
        <div className="fr-tile__content fr-pb-0">
          <h2 className="fr-tile__title">{value}</h2>
          <p className="fr-tile__desc">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function SynthesisFocus() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);
  const graphConfig = getConfig("synthesisFocus");

  const { data, isLoading } = useQuery({
    queryKey: ["SynthesisFocus", params],
    queryFn: () => GetData(params)
  })

  if (isLoading || !data) return <Template />

  const dataSuccessful = data.successful;
  const dataEvaluated = data.evaluated;
  const dataCurrentCountry_successful = dataSuccessful.countries.find((el) => el.country_code === searchParams.get("country_code"));
  const dataCurrentCountry_evaluated = dataEvaluated.countries.find((el) => el.country_code === searchParams.get("country_code"));

  return (
    <Container as="section" fluid>
      <Title as="h2" look="h4" className="fr-mb-0">{graphConfig.title}</Title>
      <p className="sources">
        Sources : <a href={graphConfig.sourceURL} target="_blank" rel="noreferrer noopener">{graphConfig.source}</a>
      </p>
      <Row gutters>
        <Col md={4}>
          <Tile
            description="part capté par les participants du pays"
            value={`${((dataCurrentCountry_successful.total_fund_eur / dataSuccessful.total_fund_eur) * 100).toFixed(1)}%`}
          />
        </Col>
        <Col md={4}>
          <Tile
            description="part des participants lauréats du pays"
            value={`${((dataCurrentCountry_successful.total_involved / dataSuccessful.total_involved) * 100).toFixed(1)}%`}
          />
        </Col>
        <Col md={4}>
          <Tile
            description="part des coordinations de projets du pays"
            value={`${((dataCurrentCountry_successful.total_coordination_number / dataSuccessful.total_coordination_number) * 100).toFixed(1)}%`}
          />
        </Col>
        <Col md={4}>
          <Tile
            description="taux de succès sur les montants"
            value={`${((dataCurrentCountry_successful.total_fund_eur / dataCurrentCountry_evaluated.total_fund_eur) * 100).toFixed(1)}%`}
          />
        </Col>
        <Col md={4}>
          <Tile
            description="taux de succès individuel des participants du pays"
            value={`${((dataCurrentCountry_successful.total_involved / dataCurrentCountry_evaluated.total_involved) * 100).toFixed(1)}%`}
          />
        </Col>
        <Col md={4}>
          <Tile
            description="taux de succès sur le nombre de projets"
            value={`${((dataCurrentCountry_successful.total_coordination_number / dataCurrentCountry_evaluated.total_coordination_number) * 100).toFixed(1)}%`}
          />
        </Col>
      </Row>
    </Container>
  )
}
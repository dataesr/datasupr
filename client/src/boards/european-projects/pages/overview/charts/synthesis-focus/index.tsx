import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Template from "./template";
import { GetData } from "./query";

import { useGetParams } from "./utils";
import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";

import "./styles.scss";
import RateCard from "../../../../components/cards/funds-cards/rate";

export default function SynthesisFocus() {
  const [searchParams] = useSearchParams();
  const params = useGetParams();

  const { data, isLoading } = useQuery({
    queryKey: ["SynthesisFocus", params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <Template />;

  const dataSuccessful = data.successful;
  const dataEvaluated = data.evaluated;
  const dataCurrentCountry_successful = dataSuccessful.countries.find((el) => el.country_code === searchParams.get("country_code"));
  const dataCurrentCountry_evaluated = dataEvaluated.countries.find((el) => el.country_code === searchParams.get("country_code"));

  return (
    <Container as="section" fluid>
      <Title as="h2">Grands chiffres</Title>
      <Row gutters>
        <Col md={4}>
          <RateCard
            nb={dataCurrentCountry_successful.total_fund_eur / dataSuccessful.total_fund_eur}
            label="part capté par les participants du pays"
            loading={false}
            tooltipText="Part des financements obtenus par les participants du pays par rapport au total des financements obtenus par tous les participants (toutes nationalités confondues)."
          />
        </Col>
        <Col md={4}>
          <RateCard
            nb={dataCurrentCountry_successful.total_involved / dataSuccessful.total_involved}
            label="part des participants lauréats du pays"
            loading={false}
            tooltipText="Part des participants du pays parmi l'ensemble des participants (toutes nationalités confondues) ayant obtenu un financement."
          />
        </Col>
        <Col md={4}>
          <RateCard
            nb={dataCurrentCountry_successful.total_coordination_number / dataSuccessful.total_coordination_number}
            label="part des coordinations de projets du pays"
            loading={false}
            tooltipText="Part des projets coordonnés par un participant du pays parmi l'ensemble des projets financés (toutes nationalités confondues)."
          />
        </Col>
        <Col md={4}>
          <RateCard
            nb={dataCurrentCountry_successful.total_fund_eur / dataCurrentCountry_evaluated.total_fund_eur}
            label="taux de succès sur les montants"
            loading={false}
            tooltipText="Part des financements obtenus par les participants du pays parmi l'ensemble des financements demandés par ces mêmes participants."
          />
        </Col>
        <Col md={4}>
          <RateCard
            nb={dataCurrentCountry_successful.total_involved / dataCurrentCountry_evaluated.total_involved}
            label="taux de succès individuel des participants du pays"
            loading={false}
            tooltipText="Part des participants du pays ayant obtenu un financement parmi l'ensemble des participants du pays ayant déposé un projet."
          />
        </Col>
        <Col md={4}>
          <RateCard
            nb={dataCurrentCountry_successful.total_coordination_number / dataCurrentCountry_evaluated.total_coordination_number}
            label="taux de succès sur le nombre de projets"
            loading={false}
            tooltipText="Part des projets coordonnés par un participant du pays parmi l'ensemble des projets déposés par ces mêmes participants."
          />
        </Col>
      </Row>
    </Container>
  );
}


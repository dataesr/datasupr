import { Col, Container, Notice, Row, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
// import FundedObjectives from "./charts/funded-objectives";
// import SynthesisFocus from "./charts/synthesis-focus";
// import MainBeneficiaries from "./charts/main-beneficiaries";

export default function Beneficiaries() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      {/* <SynthesisFocus />
      <div className="fr-my-5w" />
      <FundedObjectives />
      <div className="fr-my-5w" />
      <MainBeneficiaries /> */}
      <div className="sticky">
        <Title as="h1" look="h3">
          Bénéficiaires page
        </Title>
        <Notice closeMode={"disallow"} type={"info"}>
          Méthodo de la page <br />
          Adipisicing do excepteur tempor mollit exercitation fugiat non.
        </Notice>
        <br />
        <input type="radio" name="coordinator_radio" value="coordinator" />
        En tant que coordinaeur
        <input
          type="radio"
          name="coordinator_radio"
          value="coordinator_and_or_partner"
        />
        En tant que coordinateur et/ou partenaire
      </div>
      <div className="fr-my-5w" />
      Les 10 premiers bénéficiaires des subventions allouées
      <br />
      chart...
      <div className="fr-my-5w" />
      Selection d'un indicateur <select />
      <br />
      Statut du projet <select />
      <br />
      <br />
      Typologie des entités des principaux pays bénéficiaires
      <br />
      chart...
      <br />
      <br />
      Evolution des indicateurs au fil des programmes-cadre
      <br />
      Selection d'un type d'entité <select />
      <br />
      Période <select />
      <br />
      chart...
      <div className="fr-my-5w" />
      Coordinations de projets évalués et lauréats - France
      <br />
      Selection d'un pays <select />
      <br />
      Statut des années <select />
      <br />
      <br />
      <Row>
        <Col md={6}>
          Nombre de coordinations de projets évalués et lauréats
          <br />
          chart...
        </Col>
        <Col md={6}>
          Poids des coordinations de projets évalués et lauréats sur HE
          <br />
          chart...
        </Col>
        <Col md={6}>
          Nombre de coordinations de projets évalués et lauréats
          <br />
          chart... line
        </Col>
        <Col md={6}>
          Poids des coordinations de projets évalués et lauréats sur HE
          <br />
          chart... line
        </Col>
        <Col md={6}>
          Taux de succès sur le nombre de coordinations de projets
          <br />
          chart...
        </Col>
        <Col md={6}>
          Evolution du taux de succès sur le nombre de coordinations de projets
          <br />
          chart...
        </Col>
      </Row>
    </Container>
  );
}

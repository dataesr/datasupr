import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import MainBeneficiaries from "./charts/main-beneficiaries";
import Callout from "../../../../components/callout";
import BeneficiariesByRole from "./charts/beneficiaries-by-role";

export default function Beneficiaries() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      setSearchParams({ country_code: "FRA" });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container as="main">
      <div className="fr-my-5w" />
      {/* <div className="sticky"> */}
      <Title as="h1" look="h3">
        Entités bénéficiaires
      </Title>
      <Callout className="callout-style">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus hic inventore ipsum pariatur possimus est voluptatibus ut aspernatur
        itaque quae. Eveniet, numquam? Soluta fugit cupiditate et molestias. Tenetur, quod eligendi!
      </Callout>
      <div className="fr-my-5w" />
      <MainBeneficiaries />
      <div className="fr-my-5w" />
      <BeneficiariesByRole />
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

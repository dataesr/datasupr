import { Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Breadcrumb from "../../components/breadcrumb";


export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has("section")) {
      searchParams.delete("section");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container className="fr-mb-3w">
      <Row gutters>
        <Col>
          <Breadcrumb items={[
            { href: "/financements-par-aap/accueil", label: "Financements par AAP" },
            { label: "Accueil" },
          ]} />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <Title as="h1" look="h4">
            Suivi des financements par appels à projets
          </Title>
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <Text>
            Ce tableau de bord a pour objectif de suivre et d’analyser la participation des
            établissements français aux projets de recherche financés par appels à projets
            (AAP), qu’ils soient nationaux ou européens.
          </Text>
          <Text>
            Il fournit une vision consolidée des dynamiques de participation en s’appuyant sur
            des sources de données ouvertes et institutionnelles de référence.
          </Text>
          <Title as="h2" look="h5">
            Données mobilisées
          </Title>
          <Text>
            Les informations présentées reposent sur trois grandes catégories de sources de
            financements.
          </Text>
          <Title as="h3" look="h6">
            Financements ANR
          </Title>
          <Text>
            L'Agence Nationale de la Recherche (ANR) expose en open data deux jeux de données 
            (DGDS pour les projets ANR et DGPIE pour les projets PIA ANR). Ces sources fournissent 
            des informations détaillées sur les projets financés par l’ANR, avec une description des 
            participants généralement disponible au niveau des laboratoires pour les projets DGDS.
          </Text>
          <Title as="h3" look="h6">
            Financements européens
          </Title>
          <Text>
            Les données relatives aux programmes <strong>Horizon Europe</strong> et{' '}
            <strong>Horizon 2020</strong> sont issues du jeu de données open data{' '}
            <strong>PCRI</strong>.
          </Text>
          <Text>
            Elles décrivent principalement les participants au niveau institutionnel. Un
            travail complémentaire est mené avec le CNRS, le CEA, l’INRAE, l’INRIA et l’ONERA afin
            d’enrichir ces données et de reconstituer, lorsque cela est possible, le niveau
            laboratoire pour les financements européens. Horizon 2020 couvre la période 2014–2020, 
            tandis que son successeur, Horizon Europe couvre 2021-2027.
          </Text>
          <Title as="h3" look="h6">
            Financements PIA
          </Title>
          <Text>
            Les informations concernant les projets du Programme d’Investissements d’Avenir (PIA) non
            pilotés par l’ANR sont issues des données affichées sur Piaweb. Elles sont
            principalement disponibles à un niveau institutionnel.
          </Text>
          <Text>De plus, les <strong>référentiels de structures (RNSR)</strong> et d'<strong>établissements 
            (Paysage)</strong> permettent de rattacher chaque participation observée aux
            structures parentes (tutelles).
          </Text>
          <Title as="h2" look="h5">
            Méthodologie de comptabilisation des montants
          </Title>
          <Text>
            Les sources de financements ne renseignent pas de manière homogène les montants
            alloués à chaque participant. Dans la majorité des cas, seul le montant global du
            projet est disponible.
          </Text>
          <Text>
            En conséquence, le montant total du projet est comptabilisé pour chacun des
            participants identifiés.
          </Text>
          <div className="fr-callout fr-callout--warning fr-mt-4w">
            <Title as="h2" look="h5">
              Précautions de lecture et d’interprétation
            </Title>
            <Text>
              Les montants affichés ne correspondent pas aux financements effectivement perçus
              par un établissement. Ils représentent le volume total de financements des projets
              auxquels l’établissement participe, indépendamment de la part réelle qui lui est
              attribuée.
            </Text>
            <Text>
              Lorsque la participation est identifiée au niveau laboratoire, celle-ci est
              également reportée sur l’ensemble des tutelles du laboratoire, avec le même
              montant.
            </Text>
            <Text>
              Par exemple, la participation d'un laboratoire à un projet
              est comptabilisée à la fois pour le laboratoire
              et pour chacune de ses tutelles.
            </Text>
            <Text>
              Les montants ne doivent donc pas être interprétés comme cumulables entre niveaux
              institutionnels.
            </Text>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

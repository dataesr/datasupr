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
            Il fournit une vision consolidée des dynamiques de participation en s’appuyant sur
            des sources de données ouvertes et institutionnelles de référence.
          </Text>
          <Text>
          </Text>
          <Title as="h2" look="h5">
            🗂️ Types de financement
          </Title>
          <Text>
            Les informations présentées reposent sur trois grandes catégories de sources de
            financements.
            <br/> <strong>Financements ANR</strong> : 
            L'Agence Nationale de la Recherche (ANR) expose en open data deux jeux de données 
            (DGDS pour les projets ANR et DGPIE pour les projets PIA ANR). Ces sources fournissent 
            des informations détaillées sur les projets financés par l’ANR, avec une description des 
            participants généralement disponible au niveau des laboratoires pour les projets DGDS.
            
            <br/> <strong>Financements PIA</strong> : 
            Les informations concernant les projets du Programme d’Investissements d’Avenir (PIA) sont issues des données affichées sur Piaweb. Elles sont
            principalement disponibles à un niveau institutionnel. Pour les financements PIA ANR, les données sont croisées avec la source DGPIE ci-dessus.
            
            <br/> <strong>Financements européens</strong> : 
            Les données relatives aux programmes <strong>Horizon Europe</strong> et{' '}
            <strong>Horizon 2020</strong> sont issues du jeu de données open data{' '}
            <strong>PCRI</strong>.
            Elles décrivent principalement les participants au niveau institutionnel. Un
            travail complémentaire est mené avec le CNRS, le CEA, l’INRAE, l’INRIA et l’ONERA afin
            d’enrichir ces données et de reconstituer, lorsque cela est possible, le niveau
            laboratoire pour les financements européens. Horizon 2020 couvre la période 2014–2020,
            tandis que son successeur, Horizon Europe couvre 2021-2027.
          </Text>
          <Title as="h2" look="h5">
            ⚠️ Financement global / Financement perçu
          </Title>
          <Text>
          Deux modes de comptabilisation des financements sont exposés.
          <br/> <strong>Financement global (présence)</strong> : on compte le financement global du projet, en l'affectant à chaque établissement participant de manière égale. Cela ne correspondent pas aux financements effectivement perçus
              par un établissement. Cela représente le volume total de financements des projets
            Les sources de financements ne renseignent pas de manière homogène les montants
            perçus par chaque participant. Dans la majorité des cas, seul le montant global du
            projet est disponible.
          <br/> <strong>Financement perçu (implication)</strong> : on compte la part réelle allouée à chaque établissement partenaire d’un projet (colonne « Projet.Partenaire.Aide_allouee.ANR » dans la base ANR, « montant des subvention » dans la base Horizon Europe, « consommation » dans la base PIA. Attention, on mélange ici pour le PIA de la consommation avec des subventions allouées pour ANR et Europe. Les consommations sont affectées à l'année d'édition du projet, et pas à l'année de consommation (il peut y avoir un décalage de plusieurs années). Cela reste une <strong>approximation</strong> de l'implication de l'établissement.  
          </Text>
          <Title as="h2" look="h5">
            🏛️ Identification des partenaires
          </Title>
          <Text>
             Les <strong>référentiels de structures (RNSR)</strong> et d'<strong>établissements 
            (Paysage)</strong> permettent de rattacher chaque participation observée aux
            structures parentes (tutelles). 
          <br/> Pour l'<strong>ANR</strong> les données des 
            participants sont généralement disponibles au niveau des laboratoires pour les projets DGDS (c'est-à-dire hors PIA), et sont affectées à toutes les tutelles grâce au RNSR.
          <br/>Pour les <strong> financements européens</strong> les participants sont disponibles au niveau institutionnel pour les institutions d'accueil (Host Institution). Un
            travail complémentaire est mené avec le CNRS, le CEA, l’INRAE, l’INRIA et l’ONERA afin
            d’enrichir ces données et de reconstituer, lorsque cela est possible, le niveau
            laboratoire pour les financements européens. Cela permet d'affecter aussi l'information disponibles aux autres tutelles de ces laboratoires : ainsi, pour les institutions qui ne sont pas institutions d'accueil, l'information de présence et d'implication est quand même disponible grâce à ce travail, en passant par le niveau laboratoire. Cet enrichissement mené en collaboration avec ces cinq ONR est réalisé avec un délai d'environ un an. Il n'est donc pas disponible pour les projets les plus récents.
          </Text>
          <Title as="h2" look="h5">
            🧭 Identification des coordinateurs
          </Title>
          <Text>
Le rôle de coordinateur est indiqué dans chaque source, donc parfois au niveau institution, parfois au niveau laboratoire. Quand c'est le cas au niveau laboratoire, toutes les tutelles sont aussi considérées comme ayant un rôle de coordinateur.
Pour les <strong>financements européens</strong>, les partenaires de type PI (Principal Investigator) ou Co-PI sont considérés comme coordinateur (notamment le cas pour les ERC). 
         </Text>
        </Col>
      </Row>
    </Container>
  );
}

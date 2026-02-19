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
            l'Agence Nationale de la Recherche (ANR) expose en open data <a target='_blank' href='https://www.data.gouv.fr/organizations/agence-nationale-de-la-recherche/datasets'>deux jeux de données</a> : DGDS pour les projets ANR et DGPIE pour les projets du Programme d’investissements d’avenir gérés par l’ANR. Ces sources fournissent 
            des informations détaillées sur les projets financés par l’ANR, avec une description des 
            participants généralement disponible au niveau des laboratoires pour les projets DGDS.
            
           <br/> <strong>Financements PIA</strong> : 
          les informations concernant les projets du Programme d’Investissements d’Avenir (PIA) sont issues des données affichées sur Piaweb. Elles sont
            principalement disponibles à un niveau institutionnel. Pour les financements PIA ANR, les données sont croisées avec le jeu de données ANR-DGPIE mentionné ci-dessus.
            <br/> <strong>Financements européens</strong> : 
            les données relatives aux programmes <strong>Horizon Europe</strong> 2021-2027 et{' '}
            <strong>Horizon 2020</strong> 2014-2020 sont issues des <a target='_blank' href='https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-horizon-projects-entities/information/?disjunctive.paysage_category&disjunctive.free_keywords'>jeux de données open data</a>{' '}
             produits par le MESRE sur les projets financés et les partenaires, à partir de la base eCorda sur les programmes cadres de recherche et d’innovation de l’Union européenne.
            Ces jeux de données permettent d’identifier les participants au niveau institutionnel. Par rapport aux données diffusées en opendata par la Commission, ils apportent une information précise sur les laboratoires publics qui conduisent, en France, les projets financés. Cet enrichissement est le fruit d’ un
            travail complémentaire mené en collaboration avec le CNRS, le CEA, INRAE, Inria et l’ONERA afin
            d’enrichir ces données et de reconstituer, lorsque cela est possible, le niveau
            laboratoire pour les financements européens.
          </Text>
          <Title as="h2" look="h5">
            ⚠️ Financement global / Financement perçu
          </Title>
          <Text>
          Trois modes de comptabilisation des financements sont exposés.
          <br/> <strong>Nombre de projets financés (participation)</strong> : on compte le nombre de projets pour lesquels l’établissement est partenaire, indépendamment des financements associés.
          <br/> <strong>Financement global (volume)</strong> : on compte le financement global du projet, c'est-à-dire le montant total attribué, en l'affectant à chaque établissement participant. Cela ne correspond pas aux financements effectivement perçus par l'établissement. Cela représente le volume total de financements des projets auxquels participe l'établissement. Cet indicateur permet de traduire l'envergure des projets auxquels l'établissement participe.
          <br/> <strong>Financement perçu (implication)</strong> : on compte la part réelle allouée à chaque établissement partenaire d’un projet (colonne « Projet.Partenaire.Aide_allouee.ANR » dans la base ANR, « montant des subventions » dans la base Horizon Europe, « consommation » dans la base PIA. Attention, on mélange ici de la consommation (pour le PIA) avec des subventions allouées (pour l'ANR et Europe). Les consommations sont affectées à l'année d'édition du projet, et pas à l'année de consommation (il peut y avoir un décalage de plusieurs années). Cela reste une <strong>approximation</strong> de l'<strong>implication</strong> de l'établissement.
<br/><em>NB : Il ne s'agit pas de compte fractionnaire, aucun calcul de répartition n'est effectué.</em> 
          </Text>
          <Title as="h2" look="h5">
            🏛️ Identification des établissements partenaires
          </Title>
          <Text>
             Les <strong>référentiels de structures (<a target='_blank' href='https://rnsr.adc.education.fr/'>Répertoire national des structures de recherche - RNSR)</a></strong> et d'<strong>établissements 
            (l’application en accès restreint <a target='_blank' href='https://paysage.esr.gouv.fr/'>Paysage</a>)</strong> permettent de rattacher chaque participation observée aux
            structures parentes (tutelles). 
          <br/> Pour l'<strong>ANR</strong> les données des 
            participants sont généralement disponibles au niveau des laboratoires pour les projets DGDS (c'est-à-dire hors PIA), et sont affectées à toutes les tutelles grâce au RNSR.
          <br/>Pour les <strong> financements européens</strong> les participants sont disponibles au niveau institutionnel pour les institutions d'accueil (Host Institution). Un
            travail complémentaire est mené avec le CNRS, le CEA, INRAE, Inria et l’ONERA afin
            d’enrichir ces données et de reconstituer, lorsque cela est possible, le niveau
            laboratoire pour les financements européens. Cela permet d'affecter aussi l'information disponibles aux autres tutelles de ces laboratoires : ainsi, pour les institutions qui ne sont pas institutions d'accueil, l'information de présence et d'implication est quand même disponible grâce à ce travail, en passant par le niveau laboratoire. Cet enrichissement mené en collaboration avec ces cinq organismes nationaux de recherche est réalisé avec un délai d'environ un an (par rapport à la mise à disposition des données). Il n'est donc pas disponible pour les projets les plus récents.
          </Text>
          <Title as="h2" look="h5">
            🧭 Identification des coordinateurs
          </Title>
          <Text>
Pour les <strong>financements européens</strong>, dans l'objectif de simplifier la lecture des données en ayant une variable binaire Coordinateur Oui/Non, les partenaires de type PI (Principal Investigator) ou Co-PI sont considérés comme coordinateur (notamment le cas pour les ERC). 
Le rôle de coordinateur est indiqué dans chaque source, donc parfois au niveau institution, parfois au niveau laboratoire. Quand c'est le cas au niveau laboratoire, toutes les tutelles sont aussi considérées comme ayant un rôle de coordinateur.
         </Text>
        </Col>
      </Row>
    </Container>
  );
}

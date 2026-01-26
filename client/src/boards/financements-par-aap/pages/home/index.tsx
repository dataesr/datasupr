import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";


export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has("section")) {
      searchParams.delete("section");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container className="fr-pt-3w">
      <Row gutters>
        <Col>
          <Title>Suivi des financements par appel à projet</Title>
          <p>
            Ce tableau de bord a pour objectif de suivre et d’analyser la participation des
            établissements français aux projets de recherche financés par appels à projets
            (AAP), qu’ils soient nationaux ou européens. <br />
            Il fournit une vision consolidée des dynamiques de participation en s’appuyant sur
            des sources de données ouvertes et institutionnelles de référence.
          </p>

          <h2 className="">Données mobilisées</h2>

          <p>
            Les informations présentées reposent sur trois grandes catégories de sources de
            financement.
          </p>

          <p> <strong> Financements ANR </strong><br /> L'ANR expose en open data deux jeux de données (DGDS pour les projets ANR et DGPIE pour le PIA ANR).
            Ces sources fournissent des informations détaillées sur les projets financés par
            l’Agence nationale de la recherche, avec une description des participants
            généralement disponible au niveau des laboratoires pour les projets DGDS.
          </p>

          <p> <strong> Financements européens </strong><br />
            Les données relatives aux programmes <strong>Horizon Europe</strong> et{" "}
            <strong>Horizon 2020</strong> sont issues du jeu de données open data{" "}
            <strong>PCRI</strong>. <br />
            Elles décrivent principalement les participants au niveau institutionnel. Un
            travail complémentaire est mené avec le CNRS, le CEA, l’INRAE, l’INRIA et l’ONERA afin
            d’enrichir ces données et de reconstituer, lorsque cela est possible, le niveau
            laboratoire pour les financements européens. Horizon 2020 couvre la période 2014–2020, tandis que son successeur, Horizon Europe couvre 2021-2027
          </p>

          <p> <strong> Financement PIA </strong><br />
            Les informations concernant les projets du Programme d’investissements d’avenir non
            pilotés par l’ANR sont issues des données affichées sur Piaweb. Elles sont
            principalement disponibles à un niveau institutionnel.
          </p>

          <p>De plus, les <strong>référentiels de structures (RNSR)</strong> et d'<strong>établissements (Paysage)</strong> permettent de rattacher chaque participation observée aux
            structures parentes (tutelles).
          </p>

          <h2 className="fr-h4 fr-mt-4w">
            Méthodologie de comptabilisation des montants
          </h2>
          <p>
            Les sources de financement ne renseignent pas de manière homogène les montants
            alloués à chaque participant. Dans la majorité des cas, seul le montant global du
            projet est disponible.
          </p>
          <p>
            En conséquence, le montant total du projet est comptabilisé pour chacun des
            participants identifiés.
          </p>

          <div className="fr-callout fr-callout--warning fr-mt-4w">
            <h3 className="fr-callout__title">
              Précautions de lecture et d’interprétation
            </h3>
            <p className="fr-callout__text">
              Les montants affichés ne correspondent pas aux financements effectivement perçus
              par un établissement. Ils représentent le volume total de financement des projets
              auxquels l’établissement participe, indépendamment de la part réelle qui lui est
              attribuée.
            </p>
            <p className="fr-callout__text">
              Lorsque la participation est identifiée au niveau laboratoire, celle-ci est
              également reportée sur l’ensemble des tutelles du laboratoire, avec le même
              montant.
            </p>
            <p className="fr-callout__text">
              Par exemple, la participation d'un laboratoire à un projet
              est comptabilisée à la fois pour le laboratoire
              et pour chacune de ses tutelles.
            </p>
            <p className="fr-callout__text">
              Les montants ne doivent donc pas être interprétés comme cumulables entre niveaux
              institutionnels.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

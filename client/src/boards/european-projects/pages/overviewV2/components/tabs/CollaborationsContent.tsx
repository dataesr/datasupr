import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Row, Col, Title } from "@dataesr/dsfr-plus";
import CountriesCollaborationsBubble from "../../../collaborations/charts/countries-collaborations-bubble";
import CountriesCollaborationsTable from "../../../collaborations/charts/countries-collaborations-table";
import EntityVariablePie from "../../../collaborations/charts/entity-variable-pie";
import { ContentType } from "../../utils/displayRules";
import CountryNeighbourgs from "../../../collaborations/charts/country-neighbourgs";
import Callout from "../../../../../../components/callout";
import MapOfEuropeCollaborationsFlow from "../../../collaborations/charts/map-of-europe-collaborations-flow";
import { useGetParams } from "../../../collaborations/charts/countries-collaborations-table/utils";
import { getCollaborations } from "../../../collaborations/charts/countries-collaborations-table/query";

interface CollaborationsContentProps {
  contentType: ContentType;
  pillarId?: string | null;
  programId?: string | null;
  thematicIds?: string | null;
  destinationIds?: string | null;
}

export default function CollaborationsContent({ contentType }: CollaborationsContentProps) {
  const [searchParams] = useSearchParams();
  const params = useGetParams();
  const currentCountryCode = searchParams.get("country_code") || "FRA";

  const { data, isLoading } = useQuery({
    queryKey: ["CountriesCollaborationsTable", params],
    queryFn: () => getCollaborations(params),
  });

  const dataMap =
    isLoading || !data ? [] : data.map((item) => ({ from: currentCountryCode, to: item.country_code, weight: item.total_collaborations }));

  switch (contentType) {
    case "pillar-comparison":
    case "pillar-detail":
    case "program-detail":
    case "thematic-detail":
    case "destination-detail":
      return (
        <div>
          {isLoading ? (
            <Row>
              {/* TODO: skeleton */}
              <Col>Chargement de la carte des collaborations entre pays...</Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <MapOfEuropeCollaborationsFlow data={dataMap} />
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <CountriesCollaborationsTable />
            </Col>
            <Col>
              <CountryNeighbourgs />
            </Col>
            <Row>
              <Col>
                <CountriesCollaborationsBubble />
              </Col>
            </Row>
          </Row>
          <Row className="fr-mt-5w">
            <Col>
              <Title as="h2" look="h4">
                Répartition des collaborations par entité
              </Title>
              <Callout className="callout-style">
                Visualisez la répartition des collaborations du pilier/programme/thématique/destination sélectionné(e) par entité.
                <br /> Vous pouvez rechercher une entité spécifique pour voir ses collaborations.
                <br /> Par exemple, si vous recherchez une université, vous verrez la part des collaborations impliquant cette université par rapport
                au total des collaborations du pilier/programme/thématique/destination. Toujours dans l'écosystème du pays sélectionné.
                <br /> Cela vous permet d'identifier les entités les plus actives et de comprendre leur rôle dans les collaborations au sein du pays.
                <br /> Attention, seules les entités du pays apparaissent dans la recherche.
              </Callout>
            </Col>
          </Row>
          <Row>
            <Col>
              <EntityVariablePie />
            </Col>
          </Row>
        </div>
      );

    default:
      return <div>Aucun contenu de collaboration disponible</div>;
  }
}

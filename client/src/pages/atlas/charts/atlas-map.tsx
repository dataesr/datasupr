import { Container, Row, Col, Button, Title, Badge } from "@dataesr/dsfr-plus";
import {
  useSearchParams,
  useNavigate,
  useLocation
} from "react-router-dom";

import * as turf from '@turf/turf';

import Template from "../../../components/template/index.tsx";
import { getNumberOfStudentsHistoricByLevel, getGeoPolygon } from "../../../api/atlas.ts";
import { useQuery } from "@tanstack/react-query";
import MapWithPolygonHighcharts from "./map-with-polygon-highcharts.tsx";
import { MapBubbleDataProps } from "../../../types/atlas.ts";
import MapWithPolygonHighchartsPie from "./map-with-polygon-highcharts-pie/index.tsx";


export default function AtlasMap() {
  const location = useLocation();
  const path = location.pathname.split('/');
  const selectedTab = path[path.length - 1];

  console.log('selectedTab', selectedTab);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const geoId = searchParams.get('geo_id') || '';
  const currentYear = searchParams.get('annee_universitaire') || '2022-23';

  const { data: dataHistoric, isLoading: isLoadingHistoric } = useQuery({
    queryKey: ["atlas/number-of-students-historic-by-level", geoId],
    queryFn: () => getNumberOfStudentsHistoricByLevel(geoId, currentYear)
  })

  const { data: polygonsData, isLoading: isLoadingPolygons } = useQuery({
    queryKey: ["atlas/get-geo-polygons", geoId],
    queryFn: () => getGeoPolygon(geoId)
  })

  if (isLoadingPolygons || !polygonsData || !polygonsData.length
    || isLoadingHistoric || !dataHistoric?.data || !dataHistoric?.data.length) {
    return <div>Loading...</div>
  }

  const getSubLevel = () => {
    if (!geoId || geoId === "PAYS_100") { return 'Liste des régions'; }
    if (geoId.startsWith('R')) { return 'Liste des académies'; }
    if (geoId.startsWith('D')) { return 'Liste des communes'; }
    if (geoId.startsWith('A')) { return 'Liste des départements'; }
    if (geoId.startsWith('U')) { return 'Liste des communes'; }
  }

  const getTitle = () => {
    if (!geoId || geoId === "PAYS_100") { return 'Effectifs étudiants de la France'; }
    if (geoId.startsWith('R')) { return 'Effectifs étudiants de la région'; }
    if (geoId.startsWith('D')) { return 'Effectifs étudiants du département'; }
    if (geoId.startsWith('A')) { return 'Effectifs étudiants de l\'académie'; }
    if (geoId.startsWith('U')) { return 'Effectifs étudiants de l\'unité urbaine'; }
    return 'Effectifs étudiants de la commune';
  }

  function SubList({ data }) {
    if (isLoadingHistoric) {
      return <Template />;
    }
    if (!data) {
      return null;
    }
    return (
      <Container fluid as="section">
        <Row style={{ width: "100%" }}>
          <div style={{ flexGrow: "1" }}>
            <strong>
              <i>{getSubLevel()}</i>
            </strong>
          </div>
          <div className="fr-mb-1w">
            <Badge color="yellow-tournesol">{currentYear}</Badge>
          </div>
        </Row>
        <div style={{ height: '338px', overflow: 'auto' }}>
          {
            data.slice(0, 15).map((item) => (
              <Row style={{ width: "100%", borderBottom: '1px solid #ddd' }} key={item.geo_nom}>
                <div style={{ flexGrow: "1" }}>
                  {item.geo_nom}
                </div>
                <div className="fr-mb-1w">
                  <strong>
                    {item.data.find((el) => el.annee_universitaire === currentYear)?.effectif.toLocaleString()}
                  </strong>
                  {
                    (["R", "D", "A", "U", "P"].includes(geoId?.charAt(0))) && (
                      <Button
                        size="sm"
                        variant="text"
                        className="fr-ml-1w"
                        color="pink-tuile"
                        onClick={() => navigate(`/atlas/general?geo_id=${item.geo_id}&annee_universitaire=${currentYear}`)}
                      >
                        Voir
                      </Button>
                    )
                  }
                </div>
              </Row>
            ))
          }
        </div>
      </Container>
    );
  }


  function MapSelector() {
    const mapbubbleData: MapBubbleDataProps = [];

    switch (selectedTab) {
      case 'general':
        dataHistoric.data.forEach((item) => {
          const polygon = polygonsData.find((d) => d.originalId === item.geo_id)?.geometry || null;
          if (polygon !== 'undefined' && polygon !== null) {
            const calculateCenter = turf.centerOfMass(polygon);
            mapbubbleData.push({
              z: item.data.find((d) => d.annee_universitaire === currentYear)?.effectif || 0,
              name: item.geo_nom,
              lat: calculateCenter.geometry.coordinates[1],
              lon: calculateCenter.geometry.coordinates[0]
            });
          }
        });

        return (
          <MapWithPolygonHighcharts
            currentYear={currentYear}
            mapbubbleData={mapbubbleData}
            polygonsData={polygonsData}
          />
        );
      case 'effectifs-par-secteurs':
        return (
          <MapWithPolygonHighchartsPie />
        )

      default:
        break;
    }


    // selectedTab

  }


  return (
    <Container as="section" fluid>
      <Row>
        <Col>
          <Title as="h2" look="h5" className="fr-mb-0">
            {getTitle()}
          </Title>
        </Col>
      </Row>
      <Row gutters>
        <Col md={7}>
          <MapSelector />
        </Col>
        <Col md={5}>
          <SubList data={dataHistoric?.data} />
        </Col>
      </Row>
    </Container>
  )
}
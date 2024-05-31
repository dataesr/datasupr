import { 
  Badge,
  Button, 
  Container, Row, Col, 
} from "@dataesr/dsfr-plus";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import * as turf from '@turf/turf';

import { getNumberOfStudentsHistoricByLevel, getGeoPolygon, getNumberOfStudentsBySectorAndSublevel, getNumberOfStudentsByGenderAndSublevel } from "../../../api/atlas.ts";
import { MapBubbleDataProps } from "../../../types/atlas.ts";
import { useQuery } from "@tanstack/react-query";
import MapSkeleton from "./skeletons/map.tsx";
import MapWithPolygonHighcharts from "./map-with-polygon-highcharts.tsx";
import MapPieSectors from "./map-pie-sectors/index.jsx";
import MapPieGender from "./map-pie-genders/index.jsx";
import Template from "../../../components/template/index.tsx";
import FilieresList from "../../../components/filieres-list/index.tsx";

export default function AtlasMap() {
  const location = useLocation();
  const path = location.pathname.split('/');
  const selectedTab = path[path.length - 1];
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const geoId = searchParams.get('geo_id') || '';
  const currentYear = searchParams.get('annee_universitaire') || '2022-23';

  const { data: dataHistoric, isLoading: isLoadingHistoric } = useQuery({
    queryKey: ["atlas/number-of-students-historic-by-level", geoId, currentYear],
    queryFn: () => getNumberOfStudentsHistoricByLevel(geoId, currentYear)
  })

  const { data: polygonsData, isLoading: isLoadingPolygons } = useQuery({
    queryKey: ["atlas/get-geo-polygons", geoId],
    queryFn: () => getGeoPolygon(geoId)
  })

  const { data: dataSectors, isLoading: isLoadingDataSectors } = useQuery({
    queryKey: ["atlas/get-number-of-students-by-sector-and-sublevel", geoId, currentYear],
    queryFn: () => getNumberOfStudentsBySectorAndSublevel(geoId, currentYear)
  })

  const { data: dataGenders, isLoading: isLoadingDataGenders } = useQuery({
    queryKey: ["atlas/get-number-of-students-by-gender-and-sublevel", geoId, currentYear],
    queryFn: () => getNumberOfStudentsByGenderAndSublevel(geoId, currentYear)
  })

  if (isLoadingPolygons || !polygonsData || !polygonsData.length
    || isLoadingHistoric || !dataHistoric?.data || !dataHistoric?.data.length) {
    return <MapSkeleton />;
  }

  const getSubLevel = () => {
    if (!geoId || geoId === "PAYS_100") { return 'Liste des régions'; }
    if (geoId.startsWith('R')) { return 'Liste des académies'; }
    if (geoId.startsWith('D')) { return 'Liste des communes'; }
    if (geoId.startsWith('A')) { return 'Liste des départements'; }
    if (geoId.startsWith('U')) { return 'Liste des communes'; }
  }

  function SubList() {
    if (isLoadingHistoric) { return <Template height="338" />; }
    if (!dataHistoric?.data) { return null; }

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
        <div style={{ overflow: 'auto' }}>
          {
            dataHistoric?.data.slice(0, 15).map((item) => (
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
          <Row gutters>
            <Col md={8}>
              <MapWithPolygonHighcharts
                currentYear={currentYear}
                isLoading={isLoadingHistoric}
                mapbubbleData={mapbubbleData}
                polygonsData={polygonsData}
              />
            </Col>
            <Col md={4}>
              <SubList />
            </Col>
          </Row>
        );

      case 'effectifs-par-filiere':
          return (
            <Row gutters>
              <Col md={12}>
                <FilieresList />
              </Col>
            </Row>
          )

      case 'effectifs-par-secteurs':
        return (
          <Row gutters>
            <Col md={12}>
              <MapPieSectors
                currentYear={currentYear}
                isLoading={isLoadingDataSectors}
                mapPieData={dataSectors}
                polygonsData={polygonsData}
              />
            </Col>
          </Row>
        );

        case 'effectifs-par-genre':
          return (
            <Row gutters>
              <Col md={12}>
                <MapPieGender
                  currentYear={currentYear}
                  isLoading={isLoadingDataGenders}
                  mapPieData={dataGenders}
                  polygonsData={polygonsData}
                />
              </Col>
            </Row>
          );

      default:
        break;
    }
  }

  return (
    <Container as="section" fluid>
      <MapSelector />
    </Container>
  )
}
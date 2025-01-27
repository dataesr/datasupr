import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as turf from "@turf/turf";

import {
  getNumberOfStudentsHistoricByLevel,
  getGeoPolygon,
  getNumberOfStudentsBySectorAndSublevel,
  getNumberOfStudentsByGenderAndSublevel,
} from "../../../../api/atlas.ts";
import { MapBubbleDataProps } from "../../../../types/atlas.ts";
import MapSkeleton from "../../charts/skeletons/map.tsx";
import MapWithPolygonAndBubbles from "../../charts/map-with-polygon-and-bubbles.tsx";
import MapPieSectors from "../../charts/map-pie-sectors/index.jsx";
import MapPieGender from "../../charts/map-pie-genders/index.jsx";
import FilieresList from "../../../../components/filieres-list/index.tsx";
import SubList from "../main/tabs/components/sub-list.tsx";

import "./styles.scss";
import { DEFAULT_CURRENT_YEAR } from "../../../../constants.tsx";

export default function AtlasMap() {
  const location = useLocation();
  const path = location.pathname.split("/");
  const selectedTab = path[path.length - 1];
  const [searchParams] = useSearchParams();
  const geoId = searchParams.get("geo_id") || "";
  const currentYear = searchParams.get("annee_universitaire") || DEFAULT_CURRENT_YEAR;

  const { data: dataHistoric, isLoading: isLoadingHistoric } = useQuery({
    queryKey: [
      "atlas/number-of-students-historic-by-level",
      geoId,
      currentYear,
    ],
    queryFn: () => getNumberOfStudentsHistoricByLevel(geoId, currentYear),
  });

  const { data: polygonsData, isLoading: isLoadingPolygons } = useQuery({
    queryKey: ["atlas/get-geo-polygons", geoId],
    queryFn: () => getGeoPolygon(geoId),
  });

  const { data: dataSectors, isLoading: isLoadingDataSectors } = useQuery({
    queryKey: [
      "atlas/get-number-of-students-by-sector-and-sublevel",
      geoId,
      currentYear,
    ],
    queryFn: () => getNumberOfStudentsBySectorAndSublevel(geoId, currentYear),
  });

  const { data: dataGenders, isLoading: isLoadingDataGenders } = useQuery({
    queryKey: [
      "atlas/get-number-of-students-by-gender-and-sublevel",
      geoId,
      currentYear,
    ],
    queryFn: () => getNumberOfStudentsByGenderAndSublevel(geoId, currentYear),
  });

  if (
    isLoadingPolygons ||
    !polygonsData ||
    !polygonsData.length ||
    isLoadingHistoric ||
    !dataHistoric?.data ||
    !dataHistoric?.data.length
  ) {
    return <MapSkeleton />;
  }

  function MapSelector() {
    const mapbubbleData: MapBubbleDataProps = [];
    dataHistoric.data.forEach((item) => {
      const polygon =
        polygonsData.find((d) => d.originalId === item.geo_id)?.geometry ||
        null;
      if (polygon !== "undefined" && polygon !== null) {
        const calculateCenter = turf.centerOfMass(polygon);
        mapbubbleData.push({
          z:
            item.data.find((d) => d.annee_universitaire === currentYear)
              ?.effectif || 0,
          name: item.geo_nom,
          lat: calculateCenter.geometry.coordinates[1],
          lon: calculateCenter.geometry.coordinates[0],
        });
      }
    });

    switch (selectedTab) {
      case "general":
        // France case
        if (geoId === "PAYS_100") {
          return (
            <div className="atlas-map fr-mb-5w">
              <Row gutters>
                <Col>
                  <div style={{ width: "100%", height: "100%" }}>
                    <MapWithPolygonAndBubbles
                      currentYear={currentYear}
                      isLoading={isLoadingHistoric}
                      mapbubbleData={mapbubbleData}
                      polygonsData={polygonsData}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="drom-list">
                    <div className="drom-item">
                      <MapWithPolygonAndBubbles
                        currentYear={currentYear}
                        idToFocus="R01"
                        isLoading={isLoadingHistoric}
                        mapbubbleData={mapbubbleData}
                        polygonsData={polygonsData}
                      />
                    </div>
                    <div className="drom-item">
                      <MapWithPolygonAndBubbles
                        currentYear={currentYear}
                        idToFocus="R02"
                        isLoading={isLoadingHistoric}
                        mapbubbleData={mapbubbleData}
                        polygonsData={polygonsData}
                      />
                    </div>
                    <div className="drom-item">
                      <MapWithPolygonAndBubbles
                        currentYear={currentYear}
                        idToFocus="R03"
                        isLoading={isLoadingHistoric}
                        mapbubbleData={mapbubbleData}
                        polygonsData={polygonsData}
                      />
                    </div>
                    <div className="drom-item">
                      <MapWithPolygonAndBubbles
                        currentYear={currentYear}
                        idToFocus="R04"
                        isLoading={isLoadingHistoric}
                        mapbubbleData={mapbubbleData}
                        polygonsData={polygonsData}
                      />
                    </div>
                    <div className="drom-item">
                      <MapWithPolygonAndBubbles
                        currentYear={currentYear}
                        idToFocus="R06"
                        isLoading={isLoadingHistoric}
                        mapbubbleData={mapbubbleData}
                        polygonsData={polygonsData}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="fr-mt-5w">
                <Col>
                  <SubList />
                </Col>
              </Row>
            </div>
          );
        } else {
          return (
            <Row gutters>
              <Col md={8}>
                <MapWithPolygonAndBubbles
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
        }
      case "effectifs-par-filiere":
        return (
          <Row gutters>
            <Col md={12}>
              <FilieresList />
            </Col>
          </Row>
        );

      case "effectifs-par-secteur":
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

      case "effectifs-par-genre":
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
  );
}

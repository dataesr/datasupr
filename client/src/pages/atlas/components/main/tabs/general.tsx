import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  Badge,
  Container,
  Row,
  Col,
  Title,
  Text,
  Link,
} from "@dataesr/dsfr-plus";
import * as turf from "@turf/turf";

import { DataByYear } from "../../../../../types/atlas.ts";
import {
  getNumberOfStudents,
  getNumberOfStudentsHistoricByLevel,
  getGeoPolygon,
} from "../../../../../api/atlas.ts";
import { getNumberOfStudentsByYear } from "../../../../../api/atlas.ts";
import { MapBubbleDataProps } from "../../../../../types/atlas.ts";
import FieldsMainCard from "../../../../../components/cards/fields-main-card/index.tsx";
import GendersCard from "../../../../../components/cards/genders-card/index.tsx";
import SectorsCard from "../../../../../components/cards/sectors-card/index.tsx";
import StudentsCardWithTrend from "../../../../../components/cards/students-card-with-trend/index.tsx";
import TrendCard from "../../../charts/trend.tsx";
import SubList from "./sub-list.tsx";
import MapWithPolygonAndBubbles from "../../../charts/map-with-polygon-and-bubbles.tsx";
import MapSkeleton from "../../../charts/skeletons/map.tsx";
import ArrondissementsMap from "../../../charts/arrondissements-map/index.tsx";

import "./styles.scss";

export function General() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const currentYear = searchParams.get("annee_universitaire") || "2022-23";
  const geoId = searchParams.get("geo_id") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["atlas/number-of-students", params],
    queryFn: () => getNumberOfStudents(params),
  });

  const { data: dataByYear, isLoading: isLoadingByYear } = useQuery({
    queryKey: ["atlas/number-of-students-by-year", params],
    queryFn: () => getNumberOfStudentsByYear(params),
  });

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

  if (isLoading || isLoadingByYear) {
    return <div>Loading...</div>;
  }

  const effectifPU =
    dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)
      ?.effectif_pu || 0;
  const effectifPR =
    dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)
      ?.effectif_pr || 0;
  const pctPU = Math.round((effectifPU / (effectifPU + effectifPR)) * 100);
  const pctPR = Math.round((effectifPR / (effectifPU + effectifPR)) * 100);

  const effectifM =
    dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)
      ?.effectif_masculin || 0;
  const effectifF =
    dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)
      ?.effectif_feminin || 0;
  const pctM = Math.round((effectifM / (effectifM + effectifF)) * 100);
  const pctF = Math.round((effectifF / (effectifM + effectifF)) * 100);

  const getSubLevelName = () => {
    if (!geoId || geoId === "PAYS_100") {
      return "régions";
    }
    if (geoId.startsWith("R")) {
      return "académies";
    }
    if (geoId.startsWith("D")) {
      return "communes";
    }
    if (geoId.startsWith("A")) {
      return "départements";
    }
    if (geoId.startsWith("U")) {
      return "communes";
    }
  };

  function MapSelector() {
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

    const mapbubbleData: MapBubbleDataProps = [];
    dataHistoric.data
      .filter((item) => item.geo_id !== "R00")
      .forEach((item) => {
        let polygon;
        switch (item.geo_id) {
          case "D988":
            mapbubbleData.push({
              z:
                item.data.find((d) => d.annee_universitaire === currentYear)
                  ?.effectif || 0,
              name: item.geo_nom,
              lat: -21.7,
              lon: 166,
            });
            break;

          case "D987":
            mapbubbleData.push({
              z:
                item.data.find((d) => d.annee_universitaire === currentYear)
                  ?.effectif || 0,
              name: item.geo_nom,
              lat: -17.6,
              lon: -149.5,
            });
            break;

          case "978":
            mapbubbleData.push({
              z:
                item.data.find((d) => d.annee_universitaire === currentYear)
                  ?.effectif || 0,
              name: item.geo_nom,
              lat: 18.07,
              lon: -63.1,
            });
            break;

          default:
            polygon =
              polygonsData.find((d) => d.originalId === item.geo_id)
                ?.geometry || null;
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
        }
      });

    // France case
    if (geoId === "PAYS_100") {
      return (
        <div className="atlas-map">
          <Row className="fr-mt-5w">
            <Col>
              <Title as="h3" look="h5">
                <span
                  className="fr-icon-pie-chart-2-fill fr-mr-1w"
                  aria-hidden="true"
                />
                {`Répartition des effectifs étudiants par ${getSubLevelName()}`}
              </Title>
            </Col>
          </Row>
          <div className="container">
            <div className="Map1">
              <MapWithPolygonAndBubbles
                currentYear={currentYear}
                isLoading={isLoadingHistoric}
                mapbubbleData={mapbubbleData}
                polygonsData={polygonsData}
              />
            </div>
            <div className="col1">
              <div className="item ">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="D988"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">Nouvelle-Calédonie</div>
              </div>
            </div>
            <div className="col2">
              <div className="item ">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="D987"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">Polynésie française</div>
              </div>
            </div>
            <div className="col3">
              <div className="item ">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="978"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">Saint-Martin</div>
              </div>
            </div>
            <div className="col4">
              <div className="item ">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="D986"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">Wallis et Futuna</div>
              </div>
            </div>
            <div className="drom1">
              <div className="item">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="R01"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">Guadeloupe</div>
              </div>
            </div>
            <div className="drom2">
              <div className="item">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="R02"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">Martinique</div>
              </div>
            </div>
            <div className="drom3">
              <div className="item">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="R03"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">Guyane</div>
              </div>
            </div>
            <div className="drom4">
              <div className="item">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="R04"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">La Réunion</div>
              </div>
            </div>
            <div className="drom5">
              <div className="item">
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  idToFocus="R06"
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                <div className="item-label">Mayotte</div>
              </div>
            </div>
          </div>

          <Row className="fr-mt-5w">
            <Col>
              <SubList />
            </Col>
          </Row>
        </div>
      );
    } else {
      // cas particuliers des arrondissements (Paris/Lyon/Marseille)
      if (geoId === "D075") {
        return (
          <>
            <Row className="fr-my-5w">
              <Col>
                <Title as="h3" look="h5">
                  <span
                    className="fr-icon-pie-chart-2-fill fr-mr-1w"
                    aria-hidden="true"
                  />
                  Répartition des effectifs étudiants à Paris
                </Title>
              </Col>
            </Row>
            <Row gutters>
              <Col md={8}>
                <Title as="h4" look="h6">
                  Arrondissements de Paris
                </Title>
                <ArrondissementsMap location="paris" />
              </Col>
              <Col md={4}>
                <SubList />
              </Col>
            </Row>
          </>
        );
      }

      if (polygonsData.length > 1) {
        return (
          <>
            <Row className="fr-my-5w">
              <Col>
                <Title as="h3" look="h5">
                  <span
                    className="fr-icon-pie-chart-2-fill fr-mr-1w"
                    aria-hidden="true"
                  />
                  {`Répartition des effectifs étudiants par ${getSubLevelName()}`}
                </Title>
              </Col>
            </Row>
            <Row gutters>
              <Col md={8}>
                <MapWithPolygonAndBubbles
                  currentYear={currentYear}
                  isLoading={isLoadingHistoric}
                  mapbubbleData={mapbubbleData}
                  polygonsData={polygonsData}
                />
                {geoId === "D069" && (
                  <>
                    <Title as="h4" look="h6">
                      Arrondissements de Lyon
                    </Title>
                    <ArrondissementsMap location="lyon" />
                  </>
                )}
                {geoId === "D013" && (
                  <>
                    <Title as="h4" look="h6">
                      Arrondissements de Marseille
                    </Title>
                    <ArrondissementsMap location="marseille" />
                  </>
                )}
              </Col>
              <Col md={4}>
                <SubList />
              </Col>
            </Row>
          </>
        );
      } else {
        return (
          <Row className="fr-my-5w">
            <Col>
              <SubList />
            </Col>
          </Row>
        );
      }
    }
  }

  return (
    <Container as="section" fluid>
      <Row gutters>
        <Col md={6}>
          <StudentsCardWithTrend
            descriptionNode={
              <Badge color="yellow-tournesol">{currentYear}</Badge>
            }
            number={
              dataByYear?.find(
                (el: DataByYear) => el.annee_universitaire === currentYear
              )?.effectif_total || 0
            }
            label="Etudiants inscrits"
            trendGraph={
              <TrendCard
                color="#e18b76"
                data={dataByYear?.map((item) => item.effectif_feminin)}
              />
            }
          />
        </Col>
        <Col md={6}>
          <FieldsMainCard
            descriptionNode={
              <Badge color="yellow-tournesol">{currentYear}</Badge>
            }
            number={
              data?.filieres?.filter((el) => el.effectif_PR || el.effectif_PU)
                .length || 0
            }
            label="Nombre de filières représentées sur le territoire"
            to={`/atlas/effectifs-par-filiere?${params}`}
          />
        </Col>
      </Row>

      <MapSelector />

      <Row className="fr-mt-5w">
        <Col md={6}>
          <Title as="h3" look="h5">
            Répartition des effectifs étudiants par secteur
          </Title>
          <Text>
            Les effectifs étudiants sont répartis entre le secteur public et le
            secteur privé.
            <br />
            <br />
            <strong>{effectifPU.toLocaleString()}</strong> étudiants sont
            inscrits dans le secteur public et{" "}
            <strong>{effectifPR.toLocaleString()}</strong> dans le secteur
            privé, soit une répartition de <strong>{pctPU}%</strong> dans le
            secteur public et <strong>{pctPR}%</strong> dans le secteur privé
            pour l'année universitaire{" "}
            <Badge color="yellow-tournesol">{currentYear}</Badge>.
          </Text>
          <Link href={`/atlas/effectifs-par-secteurs?${params}`}>
            Voir le détail des effectifs par secteur
          </Link>
        </Col>
        <Col md={6}>
          <SectorsCard
            currentYear={currentYear}
            values={{
              labels: data?.secteurs?.map((item) => item.label) || [],
              values: data?.secteurs?.map((item) => item.value) || [],
            }}
          />
        </Col>
      </Row>
      <Row className="fr-mt-5w fr-mb-5w">
        <Col md={6}>
          <Title as="h3" look="h5">
            Répartition des effectifs étudiants par genre
          </Title>
          <Text>
            Les effectifs étudiants sont répartis entre les genres masculin et
            féminin.
            <br />
            <br />
            <strong>{effectifM.toLocaleString()}</strong> étudiants sont de
            genre masculin et <strong>{effectifF.toLocaleString()}</strong> de
            genre féminin, soit une répartition de <strong>{pctM}%</strong> dans
            le genre masculin et <strong>{pctF}%</strong> dans le genre féminin
            pour l'année universitaire{" "}
            <Badge color="yellow-tournesol">{currentYear}</Badge>.
          </Text>
          <Link href={`/atlas/effectifs-par-genre?${params}`}>
            Voir le détail des effectifs par genre
          </Link>
        </Col>
        <Col md={6}>
          <GendersCard
            currentYear={currentYear}
            values={{
              labels: data?.gender?.map((item) => item.label) || [],
              values: data?.gender?.map((item) => item.value) || [],
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

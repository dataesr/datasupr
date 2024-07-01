import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Title,
  Text,
  Badge,
  Button,
} from "@dataesr/dsfr-plus";

import MapPieSectors from "../../../charts/map-pie-sectors/index.jsx";
import SectortsChart from "../../../charts/sectors-pie.tsx";
import SectorHistoChart from "../../../charts/sectors-histo.tsx";
import TrendCard from "../../../charts/trend.tsx";
import {
  getGeoPolygon,
  getNumberOfStudents,
  getNumberOfStudentsBySectorAndSublevel,
  getNumberOfStudentsByYear,
  getSimilarElements,
} from "../../../../../api/atlas.ts";
import { DataByYear, SimilarData } from "../../../../../types/atlas.ts";
import StudentsCardWithTrend from "../../../../../components/cards/students-card-with-trend/index.tsx";

export function Sectors() {
  const [chartView, setChartView] = useState<"basic" | "percentage">("basic");
  const [chartType, setChartType] = useState<"column" | "line">("column");
  const [searchParams] = useSearchParams();
  const currentYear = searchParams.get("annee_universitaire") || "2022-23";
  const geoId = searchParams.get("geo_id") || "";
  const params = [...searchParams]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["atlas/number-of-students", params],
    queryFn: () => getNumberOfStudents(params),
  });

  const { data: dataByYear, isLoading: isLoadingByYear } = useQuery({
    queryKey: ["atlas/number-of-students-by-year", params],
    queryFn: () => getNumberOfStudentsByYear(params),
  });

  const effectifPU =
    dataByYear?.find(
      (el: DataByYear) => el.annee_universitaire === data?.annee_universitaire
    )?.effectif_pu || 0;
  const effectifPR =
    dataByYear?.find(
      (el: DataByYear) => el.annee_universitaire === data?.annee_universitaire
    )?.effectif_pr || 0;
  const pctPU = effectifPU / (effectifPU + effectifPR);

  function getLevel() {
    if (searchParams.get("geo_id")?.startsWith("R")) {
      return "REGION";
    }
    if (searchParams.get("geo_id")?.startsWith("D")) {
      return "DEPARTEMENT";
    }
    if (searchParams.get("geo_id")?.startsWith("A")) {
      return "ACADEMIE";
    }
    if (searchParams.get("geo_id")?.startsWith("U")) {
      return "UNITE_URBAINE";
    }
    if (searchParams.get("geo_id")?.startsWith("C")) {
      return "COMMUNE";
    }

    return "";
  }

  const gt = pctPU - pctPU * 0.05;
  const lt = pctPU + pctPU * 0.05;
  const similarParams = {
    niveau_geo: getLevel(),
    needle: "pctPU",
    gt: gt * 100,
    lt: lt * 100,
    annee_universitaire: currentYear,
  };

  const { data: dataSimilar, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ["atlas/similar-elements", similarParams],
    queryFn: () => getSimilarElements(similarParams),
  });

  const { data: dataSectorsMap, isLoading: isLoadingDataSectorsMap } = useQuery(
    {
      queryKey: [
        "atlas/get-number-of-students-by-sector-and-sublevel",
        geoId,
        currentYear,
      ],
      queryFn: () => getNumberOfStudentsBySectorAndSublevel(geoId, currentYear),
    }
  );

  const { data: polygonsData, isLoading: isLoadingPolygons } = useQuery({
    queryKey: ["atlas/get-geo-polygons", geoId],
    queryFn: () => getGeoPolygon(geoId),
  });

  // order by distance
  const dataSimilarSorted = dataSimilar
    ?.map((el: SimilarData) => {
      return {
        ...el,
        distance: Math.abs(pctPU * 100 - el.pctPU),
      };
    })
    .sort((a: SimilarData, b: SimilarData) => a.distance - b.distance);

  const dataSectors = [
    { name: "Secteur public", y: effectifPU },
    { name: "Secteur privé", y: effectifPR },
  ];

  if (
    isLoading ||
    isLoadingByYear ||
    isLoadingSimilar ||
    isLoadingDataSectorsMap ||
    isLoadingPolygons
  ) {
    return <div>Loading...</div>;
  }

  const toggleView = () => {
    if (chartView === "basic") {
      setChartView("percentage");
    } else {
      setChartView("basic");
    }
  };

  const toggleType = () => {
    if (chartType === "column") {
      setChartType("line");
    } else {
      setChartType("column");
    }
  };

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

  return (
    <Container as="section" fluid>
      <Row gutters>
        <Col>
          <Row gutters>
            <Col>
              <StudentsCardWithTrend
                descriptionNode={
                  <Badge color="brown-cafe-creme">{`Année universitaire ${currentYear}`}</Badge>
                }
                number={effectifPU}
                label="Etudiants inscrits dans le secteur public"
                trendGraph={
                  <TrendCard
                    color="#748CC0"
                    data={
                      dataByYear?.map((item: DataByYear) => item.effectif_pu) ||
                      []
                    }
                  />
                }
              />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <StudentsCardWithTrend
                descriptionNode={
                  <Badge color="brown-cafe-creme">{`Année universitaire ${currentYear}`}</Badge>
                }
                number={effectifPR}
                label="Etudiants inscrits dans le secteur privé"
                trendGraph={
                  <TrendCard
                    color="#755F4D"
                    data={dataByYear.map(
                      (item: DataByYear) => item.effectif_pr
                    )}
                  />
                }
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <SectortsChart
            data={dataSectors || []}
            isLoading={isLoading}
            currentYear={data?.annee_universitaire || ""}
          />
        </Col>
      </Row>
      {polygonsData.length > 1 && (
        <>
          <Row className="fr-my-5w">
            <Col>
              <Title as="h3" look="h5">
                <span
                  className="fr-icon-pie-chart-2-line fr-mr-1w"
                  aria-hidden="true"
                />
                {`Répartition des étudiants par ${getSubLevelName()}`}
              </Title>
            </Col>
          </Row>
          <Row gutters>
            <Col md={12}>
              <MapPieSectors
                currentYear={currentYear}
                isLoading={isLoadingDataSectorsMap}
                mapPieData={dataSectorsMap}
                polygonsData={polygonsData}
              />
            </Col>
          </Row>
        </>
      )}
      <Row className="fr-mt-5w">
        <Col>
          <Title as="h3" look="h5">
            <span
              className="fr-icon-bar-chart-box-line fr-mr-1w"
              aria-hidden="true"
            />
            Données historiques depuis l'année universitaire{" "}
            <Badge color="yellow-tournesol">2001-02</Badge>
          </Title>
          <div className="text-right">
            <Button onClick={() => toggleView()} size="sm" variant="text">
              #
              {chartView === "basic" ? (
                <span className="fr-icon-arrow-right-s-fill" />
              ) : (
                <span className="fr-icon-arrow-left-s-fill" />
              )}
              %
            </Button>
            <Button onClick={() => toggleType()} size="sm" variant="text">
              <span className="fr-icon-bar-chart-box-line" />
              {chartType === "column" ? (
                <span className="fr-icon-arrow-right-s-fill" />
              ) : (
                <span className="fr-icon-arrow-left-s-fill" />
              )}

              <span className="fr-icon-line-chart-line" />
            </Button>
          </div>
          <SectorHistoChart
            data={dataByYear}
            isLoading={isLoadingByYear}
            type={chartType}
            view={chartView}
          />
        </Col>
      </Row>
      {dataSimilarSorted?.filter((el: SimilarData) => el.geo_id !== geoId)
        .length > 0 && (
        <Row className="fr-mt-5w">
          <Col>
            <Title as="h2" look="h5">
              <span
                className="fr-icon-list-unordered fr-mr-1w"
                aria-hidden="true"
              />
              Liste des territoires similaires sur la répartition des secteurs
              pour l'année universitaire{" "}
              <Badge color="yellow-tournesol">{currentYear}</Badge>
            </Title>
            <Text>
              Les territoires similaires sont ceux qui ont une répartition du
              nombre d'étudiants inscrits dans le secteur public et privé proche
              du territoire sélectionné. La tolérance maximum est de{" "}
              <strong>5%</strong>. Seuls les 5 premiers résutats sont affichés.
              <br />
              L'année universitaire sélectionnée est{" "}
              <Badge color="yellow-tournesol">{currentYear}</Badge>.
              <br />
              Seuls les territoires ayant le même niveau géographique que le
              territoire sélectionné sont pris en compte (
              <Badge color="blue-ecume">{getLevel()}</Badge>).
              <br />
              <br />
              <ul>
                {dataSimilarSorted
                  ?.filter(
                    (el: SimilarData) =>
                      el.geo_id !== searchParams.get("geo_id")
                  )
                  .slice(0, 6)
                  .map((el: SimilarData) => (
                    <li key={el.geo_id}>
                      {el.geo_nom} (Secteur public:{" "}
                      <strong>{el.pctPU.toFixed(2)}%</strong> - Secteur privé:{" "}
                      <strong>{el.pctPR.toFixed(2)}%</strong>)
                      <Button
                        size="sm"
                        variant="text"
                        className="fr-ml-1w"
                        color="pink-tuile"
                        onClick={() =>
                          navigate(
                            `/atlas/general?geo_id=${el.geo_id}&annee_universitaire=${currentYear}`
                          )
                        }
                      >
                        Voir
                      </Button>
                    </li>
                  ))}
              </ul>
            </Text>
          </Col>
        </Row>
      )}
    </Container>
  );
}

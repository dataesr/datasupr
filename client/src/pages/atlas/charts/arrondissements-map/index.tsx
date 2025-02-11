import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as turf from "@turf/turf";

import { getNumberOfStudentsHistoricByLevel } from "../../../../api";
import Template from "../../../../components/template";
import MapWithPolygonAndBubbles from "../map-with-polygon-and-bubbles";
import data from "./georef-france-commune-arrondissement-municipal@public.json";
import { MapBubbleDataProps } from "../../../../types/atlas";
import { DEFAULT_CURRENT_YEAR } from "../../../../constants";

const config = {
  paris: {
    level: "D075",
    code: "75ZZ",
  },
  marseille: {
    level: "D013",
    code: "1398",
    arrondissements: [
      "13201",
      "13202",
      "13203",
      "13204",
      "13205",
      "13206",
      "13207",
      "13208",
      "13209",
      "13210",
      "13211",
      "13212",
      "13213",
      "13214",
      "13215",
      "13216",
    ],
  },
  lyon: {
    level: "D069",
    code: "69ZZ",
    arrondissements: [
      "69381",
      "69382",
      "69383",
      "69384",
      "69385",
      "69386",
      "69387",
      "69388",
      "69389",
    ],
  },
};

export default function ArrondissementsMap({ location }) {
  const [searchParams] = useSearchParams();
  const currentYear = searchParams.get("annee_universitaire") || DEFAULT_CURRENT_YEAR;

  const { data: dataHistoric, isLoading: isLoadingHistoric } = useQuery({
    queryKey: [
      "atlas/number-of-students-historic-by-level",
      config[location].level,
      currentYear,
    ],
    queryFn: () =>
      getNumberOfStudentsHistoricByLevel(config[location].level, currentYear),
  });

  if (isLoadingHistoric) {
    return <Template height="338" />;
  }
  if (!dataHistoric?.data) {
    return null;
  }

  const polygonsData = data.features.filter(
    (el) => el.properties.com_arm_cv_code === config[location].code
  );

  let filteredData;
  switch (location) {
    case "lyon":
    case "marseille":
      filteredData = dataHistoric.data.filter((el) =>
        config[location].arrondissements.includes(el.geo_id)
      );
      break;
    default:
      filteredData = dataHistoric.data;
  }

  const mapbubbleData: MapBubbleDataProps = [];
  filteredData.forEach((item) => {
    const polygon =
      polygonsData.find(
        (d) => d.properties.com_arm_current_code[0] === item.geo_id
      )?.geometry || null;
    if (!polygon) {
      return;
    }

    const calculateCenter = turf.centerOfMass(polygon);
    mapbubbleData.push({
      z:
        item.data.find((d) => d.annee_universitaire === currentYear)
          ?.effectif || 0,
      name: item.geo_nom,
      lat: calculateCenter.geometry.coordinates[1],
      lon: calculateCenter.geometry.coordinates[0],
    });
  });

  return (
    <MapWithPolygonAndBubbles
      currentYear={currentYear}
      isLoading={isLoadingHistoric}
      mapbubbleData={mapbubbleData}
      // @ts-expect-error : Paris, Marseillle, Lyon are special cases
      polygonsData={polygonsData}
    />
  );
}

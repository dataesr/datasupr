import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as turf from "@turf/turf";

import { getNumberOfStudentsHistoricByLevel } from "../../../../api";
import Template from "../../../../components/template";
import MapWithPolygonAndBubbles from "../map-with-polygon-and-bubbles";
import data from "./georef-france-commune-arrondissement-municipal@public.json";
import { MapBubbleDataProps } from "../../../../types/atlas";

// console.log(data.features);

export default function ParisArrondissementsMap() {
  const [searchParams] = useSearchParams();
  const currentYear = searchParams.get("annee_universitaire") || "2022-23";

  const { data: dataHistoric, isLoading: isLoadingHistoric } = useQuery({
    queryKey: [
      "atlas/number-of-students-historic-by-level",
      "D075",
      currentYear,
    ],
    queryFn: () => getNumberOfStudentsHistoricByLevel("D075", currentYear),
  });

  if (isLoadingHistoric) {
    return <Template height="338" />;
  }
  if (!dataHistoric?.data) {
    return null;
  }

  const polygonsData = data.features.filter(
    (el) => el.properties.com_arm_cv_code === "75ZZ"
  );

  const mapbubbleData: MapBubbleDataProps = [];
  dataHistoric.data.forEach((item) => {
    const polygon =
      polygonsData.find(
        (d) => d.properties.com_arm_current_code[0] === item.geo_id
      )?.geometry || null;

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
      // @ts-expect-error : Paris is a special case
      polygonsData={polygonsData}
    />
  );
}

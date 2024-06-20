import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import { MapBubbleDataProps, PolygonsDataProps } from "../../../types/atlas";
import MapSkeleton from "./skeletons/map";

highchartsMap(Highcharts);

export default function MapWithPolygonAndBubbles({
  currentYear,
  idToFocus,
  isLoading,
  mapbubbleData = [],
  polygonsData = [],
}: {
  currentYear: string;
  idToFocus?: string;
  isLoading: boolean;
  mapbubbleData: MapBubbleDataProps;
  polygonsData: PolygonsDataProps;
}) {
  const [searchParams] = useSearchParams();
  const geoId = searchParams.get("geo_id") || "";

  if (isLoading) {
    return <MapSkeleton />;
  }

  const mapOptions = {
    chart: {
      map: "countries/ie/ie-all",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    mapNavigation: {
      enabled: false,
    },
    mapView: {
      projection: {
        name: "WebMercator",
      },
    },
    tooltip: {
      headerFormat: "Effectifs étudiants - " + currentYear + "<br>",
      pointFormat: "<b>{point.name}</b> : {point.z} étudiants",
    },
    series: [
      {
        name: "Basemap",
        mapData: polygonsData,
        borderColor: "#A0A0A0",
        nullColor: "rgba(200, 200, 200, 0.3)",
        showInLegend: false,
      },
      {
        type: "mapbubble",
        name: `Effectifs étudiants ${currentYear}`,
        color: "#D5706F",
        data: mapbubbleData,
        cursor: "pointer",
        showInLegend: false,
      },
    ],
  };

  const currentId = idToFocus || geoId;

  // special case : Normandie - ignore St-Pierre-et-Miquelon
  if (currentId === "R28") {
    mapOptions.mapView["center"] = [-0.3, 49];
    mapOptions.mapView["zoom"] = 7.2;
  }

  // special case : France - centeringOnMetropolitanFrance
  if (currentId === "PAYS_100") {
    mapOptions.mapView["center"] = [2.5, 47];
    mapOptions.mapView["zoom"] = 5.05;
  }

  // special case : France but idToFocus === Guadeloupe
  if (geoId === "PAYS_100" && currentId === "R01") {
    mapOptions.mapView["center"] = [-61.55, 15.35];
    mapOptions.mapView["zoom"] = 7.7;
  }

  // special case : France but idToFocus === Martinique
  if (geoId === "PAYS_100" && currentId === "R02") {
    mapOptions.mapView["center"] = [-61, 13.8];
    mapOptions.mapView["zoom"] = 7.7;
  }

  // special case : France but idToFocus === Guyanne
  if (geoId === "PAYS_100" && currentId === "R03") {
    mapOptions.mapView["center"] = [-53, -1.1];
    mapOptions.mapView["zoom"] = 5.1;
  }

  // special case : France but idToFocus === La Réunion
  if (geoId === "PAYS_100" && currentId === "R04") {
    mapOptions.mapView["center"] = [55.55, -21.95];
    mapOptions.mapView["zoom"] = 7.7;
  }

  // special case : France but idToFocus === Mayotte
  if (geoId === "PAYS_100" && currentId === "R06") {
    mapOptions.mapView["center"] = [45.1, -13.5];
    mapOptions.mapView["zoom"] = 8;
  }

  return (
    <HighchartsReact
      constructorType={"mapChart"}
      highcharts={Highcharts}
      options={mapOptions}
    />
  );
}

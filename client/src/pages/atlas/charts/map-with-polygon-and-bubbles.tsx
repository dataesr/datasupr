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
      backgroundColor: "transparent",
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
        borderColor: "var(--border-default-grey)",
        nullColor: "var(--background-contrast-grey)",
        showInLegend: false,
        states: {
          inactive: {
            opacity: 1,
          },
        },
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
    mapOptions.mapView["center"] = [2.5, 46.5];
    mapOptions.mapView["zoom"] = 5.7;
    mapOptions.chart["height"] = "600px";
  }

  // special case : France but idToFocus === Guadeloupe
  if (geoId === "PAYS_100" && currentId === "R01") {
    mapOptions.mapView["center"] = [-61.55, 15.45];
    mapOptions.mapView["zoom"] = 7.7;
  }

  // special case : France but idToFocus === Martinique
  if (geoId === "PAYS_100" && currentId === "R02") {
    mapOptions.mapView["center"] = [-61, 13.9];
    mapOptions.mapView["zoom"] = 7.7;
  }

  // special case : France but idToFocus === Guyanne
  if (geoId === "PAYS_100" && currentId === "R03") {
    mapOptions.mapView["center"] = [-53, -1];
    mapOptions.mapView["zoom"] = 5.1;
  }

  // special case : France but idToFocus === La Réunion
  if (geoId === "PAYS_100" && currentId === "R04") {
    mapOptions.mapView["center"] = [55.55, -21.85];
    mapOptions.mapView["zoom"] = 7.7;
  }

  // special case : France but idToFocus === Mayotte
  if (geoId === "PAYS_100" && currentId === "R06") {
    mapOptions.mapView["center"] = [45.1, -13.4];
    mapOptions.mapView["zoom"] = 8;
  }

  // special case : France but idToFocus === Nouvelle-Calédonie
  if (geoId === "PAYS_100" && currentId === "D988") {
    mapOptions.mapView["center"] = [165.7, -21];
    mapOptions.mapView["zoom"] = 5.5;
    mapOptions.chart["height"] = "150";
    mapOptions.chart["width"] = "130";
  }

  // special case : France but idToFocus === Polynésie française
  if (geoId === "PAYS_100" && currentId === "D987") {
    mapOptions.mapView["center"] = [-149.5, -17.5];
    mapOptions.mapView["zoom"] = 7;
    mapOptions.chart["height"] = "150";
    mapOptions.chart["width"] = "130";
  }

  // special case : France but idToFocus === Saint-Martin
  if (geoId === "PAYS_100" && currentId === "978") {
    mapOptions.mapView["center"] = [-63.1, 18.1];
    mapOptions.mapView["zoom"] = 9;
    mapOptions.chart["height"] = "150";
    mapOptions.chart["width"] = "130";
  }

  // special case : France but idToFocus === Wallis et Futuna
  if (geoId === "PAYS_100" && currentId === "D986") {
    mapOptions.mapView["center"] = [-178, -13.3];
    mapOptions.mapView["zoom"] = 9;
    mapOptions.chart["height"] = "150";
    mapOptions.chart["width"] = "130";
  }

  return (
    <HighchartsReact
      constructorType={"mapChart"}
      highcharts={Highcharts}
      options={mapOptions}
    />
  );
}

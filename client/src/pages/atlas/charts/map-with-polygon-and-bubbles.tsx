import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import { MapBubbleDataProps, PolygonsDataProps } from "../../../types/atlas";
import MapSkeleton from "./skeletons/map";

highchartsMap(Highcharts);

export default function MapWithPolygonAndBubbles({
  currentYear,
  isLoading,
  mapbubbleData = [],
  polygonsData = [],
}: {
  currentYear: string;
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
      },
    ],
  };

  // special case : Normandie - ignore St-Pierre-et-Miquelon
  if (geoId === "R28") {
    mapOptions["mapView"] = {
      center: [-0.3, 49],
      zoom: 7.5,
    };
  }

  // special case : France - ignore DROM-COM
  if (geoId === "PAYS_100") {
    mapOptions["mapView"] = {
      center: [2.5, 47],
      zoom: 5.5,
    };
  }

  return (
    <HighchartsReact
      constructorType={"mapChart"}
      highcharts={Highcharts}
      options={mapOptions}
    />
  );
}

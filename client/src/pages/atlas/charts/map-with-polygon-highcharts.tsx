import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import { MapBubbleDataProps, PolygonsDataProps } from "../../../types/atlas";

highchartsMap(Highcharts);

export default function MapWithPolygonHighcharts({
  currentYear,
  mapbubbleData = [],
  polygonsData = [],
}: {
  currentYear: string,
  mapbubbleData: MapBubbleDataProps,
  polygonsData: PolygonsDataProps,
}
) {
  const mapOptions = {
    chart: {
      map: "countries/ie/ie-all"
    },
    title: {
      text: ""
    },
    credits: {
      enabled: false
    },
    mapNavigation: {
      enabled: false
    },
    tooltip: {
      headerFormat: "Effectifs étudiants - " + currentYear + "<br>",
      pointFormat: "<b>{point.name}</b> : {point.z} étudiants"
    },
    series: [
      {
        name: "Basemap",
        mapData: polygonsData,
        borderColor: "#A0A0A0",
        nullColor: "rgba(200, 200, 200, 0.3)",
        showInLegend: false
      },
      {
        type: "mapbubble",
        name: `Effectifs étudiants ${currentYear}`,
        color: "#D5706F",
        data: mapbubbleData,
        cursor: "pointer",
        point: {
          events: {
            click: function (e) {
              console.log(e);
            }
          }
        }
      }
    ]
  };
  return (
    <section>
      <HighchartsReact
        constructorType={"mapChart"}
        highcharts={Highcharts}
        options={mapOptions}
      />
    </section>
  );
}

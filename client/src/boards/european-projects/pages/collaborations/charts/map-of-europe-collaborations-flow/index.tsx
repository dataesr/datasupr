import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import highchartsFlowMap from "highcharts/modules/flowmap";

highchartsFlowMap(Highcharts);

import dataCountries from "../../../../../../assets/countriesCentroids.json";
// import data from "./data.json";
// import mapData from "./mapData.json";

// import topology from "../../../../../../assets/europe.topo.json";
import topology from "../../../../../../assets/world.topo.json";

export default function MapOfEuropeCollaborationsFlow(data) {
  const mapOptions = {
    chart: {
      map: topology,
    },

    title: {
      text: "Highmaps basic flowmap demo",
    },

    subtitle: {
      text: "Highcharts Maps flow map",
    },

    mapNavigation: {
      enabled: true,
    },

    legend: {
      enabled: false,
    },

    accessibility: {
      point: {
        valueDescriptionFormat: "{xDescription}.",
      },
    },

    plotOptions: {
      mappoint: {
        tooltip: {
          headerFormat: "{point.point.name}<br>",
          pointFormat: "Lat: {point.lat} Lon: {point.lon}",
        },
      },
    },

    series: [
      {
        name: "Basemap",
        showInLegend: false,
        states: {
          inactive: {
            enabled: false,
          },
        },
      },
      {
        type: "mappoint",
        id: "europe",
        name: "Countries",
        dataLabels: {
          format: "{point.id}",
        },
        data: dataCountries.map((country) => ({ id: country.iso3, lat: country.lat, lon: country.lon, name: country.name_en })),
      },
      {
        type: "flowmap",
        name: "Flow route",
        accessibility: {
          description: "This is a demonstration of the flowmap using weighted links.",
        },
        linkedTo: ":previous",
        minWidth: 5,
        maxWidth: 15,
        growTowards: true,
        markerEnd: {
          width: "50%",
          height: "50%",
        },
        fillColor: "#7931ccff",
        fillOpacity: 1,
        color: "#5a097aff",
        data: data.data,
      },
    ],
  };

  return <HighchartsReact constructorType={"mapChart"} highcharts={Highcharts} options={mapOptions} />;
}

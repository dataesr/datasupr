import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import highchartsFlowMap from "highcharts/modules/flowmap";
highchartsFlowMap(Highcharts);

import dataCountries from "../../../../../../assets/countriesCentroids.json";
import topology from "../../../../../../assets/world.topo.json";

export default function MapOfEuropeCollaborationsFlow(data) {
  const mapOptions = {
    chart: {
      map: topology,
    },

    title: {
      text: "Collaborations avec les pays",
    },
    mapNavigation: {
      enabled: true,
    },
    legend: {
      enabled: false,
    },
    credits: {
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
        name: "Common projects",
        // accessibility: {
        //   description: "This is a demonstration of the flowmap using weighted links.",
        // },
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

import type HighchartsInstance from "highcharts/es-modules/masters/highcharts.src.js";

import topology from "../../../../../../assets/europe.topo.json";

type MapDataItem = {
  "iso-a3": string;
  value: number;
  name: string;
};

export function getMapOptions(mapData: MapDataItem[], currentLang: string): HighchartsInstance.Options {
  return {
    chart: {
      map: topology,
      height: "100%",
      borderWidth: 0,
      plotBorderWidth: 0,
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    mapView: {
      padding: 0,
    },
    colorAxis: {
      min: 0,
      minColor: "#e6f2ff",
      maxColor: "#7C3AED",
      labels: {
        style: {
          color: "var(--text-title-grey)",
        },
      },
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    mapNavigation: {
      enabled: false,
    },
    accessibility: {
      point: {
        valueDescriptionFormat: "{xDescription}.",
      },
    },
    tooltip: {
      pointFormat: "{point.name}: <b>{point.value}</b> " + (currentLang === "fr" ? "collaborations" : "collaborations"),
    },
    series: [
      {
        type: "map",
        name: currentLang === "fr" ? "Collaborations" : "Collaborations",
        data: mapData,
        joinBy: "iso-a3",
        states: {
          hover: {
            color: "#000091",
          },
        },
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };
}

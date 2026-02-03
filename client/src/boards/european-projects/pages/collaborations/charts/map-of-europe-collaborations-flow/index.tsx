import HighchartsInstance from "highcharts";
import { useSearchParams } from "react-router-dom";

import "highcharts/modules/flowmap";

import dataCountries from "../../../../../../assets/countriesCentroids.json";
import topology from "../../../../../../assets/world.topo.json";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CreateChartOptions } from "../../../../components/chart-ep";
import { getCssColor } from "../../../../../../utils/colors";

export default function MapOfEuropeCollaborationsFlow(data) {
  const [searchParams] = useSearchParams();
  const countryCode = searchParams.get("country_code");

  const config = {
    id: "map-of-europe-collaborations-flow",
    title: {
      en: "Map of collaborations with countries",
      fr: "Carte des collaborations avec les pays",
    },
  };

  // Extract unique country codes from flow data
  const countriesWithData = new Set<string>();
  if (data.data && Array.isArray(data.data)) {
    data.data.forEach((flow) => {
      if (flow.from) countriesWithData.add(flow.from);
      if (flow.to) countriesWithData.add(flow.to);
    });
  }

  // Filter countries to only show those with data
  const filteredCountries = dataCountries.filter((country) => countriesWithData.has(country.iso3));

  // Get center coordinates for the selected country or default to France
  let mapCenter: [number, number] = [2, 46];
  if (countryCode) {
    const selectedCountry = dataCountries.find((country) => country.iso3.toLowerCase() === countryCode.toLowerCase());
    if (selectedCountry) {
      mapCenter = [selectedCountry.lon, selectedCountry.lat];
    }
  }

  const mapOptions: HighchartsInstance.Options = {
    chart: {
      map: topology,
      borderWidth: 1,
      borderColor: "var(--border-default-grey)",
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    mapView: {
      zoom: 2.5,
      center: mapCenter,
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "var(--text-title-grey)",
      },
    },
    mapNavigation: {
      enabled: true,
    },
    accessibility: {
      point: {
        valueDescriptionFormat: "{xDescription}.",
      },
    },
    plotOptions: {
      mappoint: {
        enableMouseTracking: false,
      },
    },
    series: [
      {
        type: "map",
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
        name: "Collaborations",
        color: "#000000ff",
        dataLabels: {
          format: "{point.id}",
        },
        data: filteredCountries.map((country) => ({ id: country.iso3, lat: country.lat, lon: country.lon, name: country.name_en })),
      },
      {
        type: "flowmap",
        name: "Common projects",
        showInLegend: false,
        minWidth: 3,
        maxWidth: 10,
        markerEnd: {
          width: "50%",
          height: "50%",
        },
        fillOpacity: 1,
        color: getCssColor("main-partner"),
        fillColor: "#38104d",
        data: data.data,
      },
    ],
  };

  // Add a dummy series for legend display of flowmap color
  mapOptions.series = [
    ...(mapOptions.series || []),
    {
      type: "scatter",
      name: "Common projects",
      data: [],
      color: getCssColor("main-partner"),
      showInLegend: true,
    },
  ];

  const options = CreateChartOptions("packedbubble", mapOptions);

  return <ChartWrapper config={config} options={options} constructorType={"mapChart"} />;
}

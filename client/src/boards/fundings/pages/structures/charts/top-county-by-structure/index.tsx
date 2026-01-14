import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector";
import { getGeneralOptions, getLabelFromName } from "../../../../utils";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopCountyByStructure() {
  const [searchParams] = useSearchParams();
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const next = new URLSearchParams(searchParams);
  const selectedStructure = next.get("structure")?.toString() ?? "";
  const color = useChartColor();
  const nbYears = Number(selectedYearEnd) - Number(selectedYearStart);

  const { data: mapData, isLoading: isLoadingTopology } = useQuery({
    queryKey: ["topo-fr"],
    queryFn: () => fetch("https://code.highcharts.com/mapdata/countries/fr/fr-all.topo.json").then((response) => response.json()),
  });

  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              project_year: {
                gte: selectedYearStart,
                lte: selectedYearEnd,
              },
            },
          },
          {
            term: {
              "co_partners_fr_inst.keyword": selectedStructure,
            },
          },
          {
            terms: {
              "project_type.keyword": ["ANR", "PIA ANR", "PIA hors ANR", "Horizon 2020", "Horizon Europe"],
            },
          },
        ],
      },
    },
    aggs: {
      by_county: {
        terms: {
          field: "address.region.keyword",
          size: 50,
        },
      },
    },
  };

  const { data: dataCounty, isLoading: isLoadingCounty } = useQuery({
    queryKey: ["fundings-top-county", selectedStructure, selectedYearEnd, selectedYearStart],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-participations-staging`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  if (isLoadingTopology || !mapData || isLoadingCounty || !dataCounty) return <DefaultSkeleton />;

  const data = dataCounty.aggregations?.by_county?.buckets.map((bucket) => {
    let county = bucket.key;
    if (county === "Guyane") county = "Guyane française";
    if (county === "Provence-Alpes-Côte d'Azur") county = "Provence-Alpes-Côte-d'Azur";
    const county_id = mapData.objects.default.geometries.find((item) => item.properties.name === county)?.properties?.["hc-key"];
    return [county_id, bucket.doc_count];
  });

  const options = {
    ...getGeneralOptions("", [], "", ""),
    chart: { backgroundColor: "transparent", margin: 0 },
    colorAxis: {
        dataClasses: [
            { from: 0, to: 100 * nbYears, color: '#f2f2f2' },
            { from: 100 * nbYears, to: 300 * nbYears, color: '#dbe4ee' },
            { from: 300 * nbYears, to: 1000 * nbYears, color: '#9ebcda' },
            { from: 1000 * nbYears, to: 3000 * nbYears, color: '#f2b8a2' },
            { from: 3000 * nbYears, color: '#e07a5f' }
        ]
    },
    legend: { align: "right", layout: "vertical" },
    mapView: { padding: [50, 0, 30, 0] },
    plotOptions: { map: { states: { hover: { borderColor: "#1e2538" } } } },
    series: [
      {
        data,
        mapData,
        name: mapData.title || "Map",
      },
    ],
    title: { text: "" },
    tooltip: {
      format: `La structure <b>${getLabelFromName(
        selectedStructure
      )}</b> a participé à <b>{point.value}</b> projets en région <b>{point.name}</b> sur la période <b>${selectedYearStart}-${selectedYearEnd}</b>`,
    },
  };

  const config = {
    id: "topCountryByStructure",
    integrationURL: "/integration?chart_id=topCountryByStructure",
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-county-by-structure">
      <Title as="h3" look="h6">
        {`Nombre de participations pour ${getLabelFromName(selectedStructure)} par région sur la période ${selectedYearStart}-${selectedYearEnd}`}
      </Title>
      <YearsSelector
        selectedYearEnd={selectedYearEnd}
        selectedYearStart={selectedYearStart}
        setSelectedYearEnd={setSelectedYearEnd}
        setSelectedYearStart={setSelectedYearStart}
      />
      <ChartWrapper config={config} constructorType="mapChart" options={options} />
    </div>
  );
}

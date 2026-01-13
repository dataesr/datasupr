import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector.tsx";
import { getGeneralOptions } from "../../../../utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopCounty() {
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const color = useChartColor();
  const nbYears = Number(selectedYearEnd) - Number(selectedYearStart);
  const { data: topology, isLoading: isLoadingTopology } = useQuery({
    queryKey: ['topo-fr'],
    queryFn: () => fetch('https://code.highcharts.com/mapdata/countries/fr/fr-all.topo.json').then((response) => response.json()),
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
                lte: selectedYearEnd
              }
            }
          }
        ]
      }
    },
    aggs: {
      by_county: {
        terms: {
          field: "address.region.keyword",
          size: 50
        }
      }
    }
  }

  const { data: dataCounty, isLoading: isLoadingCounty } = useQuery({
    queryKey: ['fundings-top-county', selectedYearEnd, selectedYearStart],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-participations`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  if (isLoadingTopology || !topology || isLoadingCounty || !dataCounty) return <DefaultSkeleton />;

  const data = dataCounty.aggregations.by_county.buckets.map((bucket) => {
    let county = bucket.key;
    if (county === 'Guyane') county = 'Guyane française';
    if (county === "Provence-Alpes-Côte d'Azur") county = "Provence-Alpes-Côte-d'Azur";
    const county_id = topology.objects.default.geometries.find((item) => item.properties.name === county)?.properties?.['hc-key'];
    return [county_id, bucket.doc_count]
  });

  const config = {
    id: "topCounty",
    integrationURL: "/integration?chart_id=topCounty",
  };

  const options = {
    ...getGeneralOptions('', [], '', ''),
    chart: { backgroundColor: 'transparent', margin: 0 },
    colorAxis: {
        dataClasses: [
            { from: 0, to: 100 * nbYears, color: '#f2f2f2' },
            { from: 100 * nbYears, to: 300 * nbYears, color: '#dbe4ee' },
            { from: 300 * nbYears, to: 1000 * nbYears, color: '#9ebcda' },
            { from: 1000 * nbYears, to: 3000 * nbYears, color: '#f2b8a2' },
            { from: 3000 * nbYears, color: '#e07a5f' }
        ]
    },
    legend: { align: 'right', layout: 'vertical' },
    mapView: { padding: [20, 0, 0, 0] },
    plotOptions: { map: { states: { hover: { borderColor: '#1e2538' } } } },
    series: [
      {
        data,
        mapData: topology,
        name: topology.title || 'Map'
      }
    ],
    title: { text: "" },
    tooltip: {
      format: `La région <b>{point.name}</b> a participé à {point.value} projets sur la période <b>${selectedYearStart}-${selectedYearEnd}</b>`
    }
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-county">
      <Title as="h3" look="h6">
        {`Nombre de participations par région sur la période ${selectedYearStart}-${selectedYearEnd}`}
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
};

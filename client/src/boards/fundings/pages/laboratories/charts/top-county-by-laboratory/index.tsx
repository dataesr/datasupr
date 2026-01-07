import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getGeneralOptions, getLabelFromName } from "../../../../utils";
import LaboratoriesSelector from "../../components/laboratoriesSelector";
import YearsSelector from "../../../../components/yearsSelector";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopCountyByLaboratory() {
  const [selectedLaboratoryId, setSelectedLaboratoryId] = useState<string>("265906719###FR_Centre hospitalier régional universitaire de Lille");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const color = useChartColor();

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
          },
          {
            term: {
              "co_partners_fr_labs.keyword": selectedLaboratoryId
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
    queryKey: ['fundings-top-county', selectedLaboratoryId, selectedYearEnd, selectedYearStart],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-participations-20251213`, {
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
    id: "topCountyByLaboratory",
    integrationURL: "/integration?chart_id=topCountyByLaboratory",
  };

  const options = {
    ...getGeneralOptions('', [], '', ''),
    chart: { backgroundColor: 'transparent', margin: 0 },
    colorAxis: { maxColor: '#4ba5a6', minColor: '#ffffff' },
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
      format: `Le laboratoire <b>${getLabelFromName(selectedLaboratoryId)}</b> a participé à <b>{point.value}</b> projets en région <b>{point.name}</b> sur la période <b>${selectedYearStart}-${selectedYearEnd}</b>`
    }
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-county-by-laboratory">
      <Title as="h3" look="h6">
        {`Nombre de participations par région sur la période ${selectedYearStart}-${selectedYearEnd}`}
      </Title>
      <LaboratoriesSelector
        selectedLaboratoryId={selectedLaboratoryId}
        setSelectedLaboratoryId={setSelectedLaboratoryId}
      />
      <YearsSelector
        selectedYearEnd={selectedYearEnd}
        selectedYearStart={selectedYearStart}
        setSelectedYearEnd={setSelectedYearEnd}
        setSelectedYearStart={setSelectedYearStart}
      />
      <ChartWrapper
        config={config}
        constructorType="mapChart"
        legend={null}
        options={options}
      />
    </div>
  );
};

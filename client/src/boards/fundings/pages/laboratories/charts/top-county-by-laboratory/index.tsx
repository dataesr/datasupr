import { useQuery } from "@tanstack/react-query";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getGeneralOptions } from "../../../../utils.ts";
import LaboratoriesSelector from "../../components/laboratoriesSelector";
import YearsSelector from "../../components/yearsSelector";

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
              "co_partners_fr_inst.keyword": selectedLaboratoryId
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

  const options = {
    ...getGeneralOptions('', [], '', ''),
    chart: {
      backgroundColor: 'transparent',
      margin: 0
    },
    title: {
      text: null
    },
    mapView: {
      padding: [30, 0, 0, 0]
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        align: 'right',
        alignTo: 'spacingBox'
      }
    },
    navigation: {
      buttonOptions: {
        theme: {
          stroke: '#e6e6e6'
        }
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right'
    },
    colorAxis: {
      minColor: '#ffffff',
      maxColor: '#4ba5a6'
    },
    series: [
      {
        name: topology.title || 'Map',
        mapData: topology,
        data
      }
    ]
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="top-county-by-laboratory">
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
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={"mapChart"}
      />
    </div>
  );
};

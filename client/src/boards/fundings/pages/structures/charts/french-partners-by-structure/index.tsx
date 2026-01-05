import { useQuery } from "@tanstack/react-query";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector.tsx";
import { getGeneralOptions } from "../../../../utils.ts";
import StructuresSelector from "../../components/structuresSelector.tsx";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function FrenchPartnersByStructure() {
  const [selectedStructureId, setSelectedStructureId] = useState<string>("180089013###FR_Centre national de la recherche scientifique|||EN_French National Centre for Scientific Research");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const color = useChartColor();

  const { data: mapData, isLoading: isLoadingTopology } = useQuery({
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
              participant_isFrench: true
            }
          },
          {
            term: {
              participant_status: "active"
            }
          },
          {
            term: {
              participant_type: "institution",
            }
          },
          {
            term: {
              "co_partners_fr_inst.keyword": selectedStructureId
            }
          }
        ]
      }
    },
    aggs: {
      by_lat: {
        terms: {
          field: "address.gps.lat",
          size: 1000
        },
        aggs: {
          by_lon: {
            terms: {
              field: "address.gps.lon",
              size: 1000
            }
          }
        }
      }
    }
  }

  const { data: dataPartners, isLoading: isLoadingPartners } = useQuery({
    queryKey: ['fundings-french-partners', selectedStructureId, selectedYearEnd, selectedYearStart],
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

  if (isLoadingTopology || !mapData || isLoadingPartners || !dataPartners) return <DefaultSkeleton />;

  const data = dataPartners.aggregations.by_lat.buckets.map((lat) => lat.by_lon.buckets.map((lon) => ({
    lat: lat.key,
    lon: lon.key,
    z: lon.doc_count,
  }))).flat();

  const options = {
    ...getGeneralOptions('', [], '', ''),
    chart: { backgroundColor: 'transparent', margin: 0 },
    legend: { enabled: false },
    mapView: { padding: [50, 0, 30, 0] },
    series: [
      {
        name: mapData.title || 'France',
        mapData,
      }, {
        type: 'mapbubble',
        mapData,
        name: 'Nombre de participations communes',
        data,
        tooltip: {
          pointFormat: '{point.z} participation(s)'
        }
      }
    ],
    title: {
      style: { color: '#ffffff' },
      text: `Partenaires français, insitutionnels et actifs sur la période ${selectedYearStart}-${selectedYearEnd}`
    }
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="french-partners-by-structure">
      <StructuresSelector
        selectedStructureId={selectedStructureId}
        setSelectedStructureId={setSelectedStructureId}
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

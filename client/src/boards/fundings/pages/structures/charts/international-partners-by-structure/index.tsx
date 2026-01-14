import { Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import YearsSelector from "../../../../components/yearsSelector.tsx";
import { getGeneralOptions, getLabelFromGps, getLabelFromName } from "../../../../utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function InternationalPartnersByStructure() {
  const [searchParams] = useSearchParams();
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const next = new URLSearchParams(searchParams);
  const selectedStructure = next.get("structure")?.toString() ?? "";
  const color = useChartColor();

  const { data: mapData, isLoading: isLoadingTopology } = useQuery({
    queryKey: ['topo-world'],
    queryFn: () => fetch('https://code.highcharts.com/mapdata/custom/world.topo.json').then((response) => response.json()),
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
              participant_isFrench: false,
            },
          },
          {
            term: {
              participant_status: "active",
            },
          },
          {
            term: {
              participant_type: "institution",
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
        ]
      }
    },
    aggs: {
      by_gps: {
        terms: {
          field: "address.gps_id_name.keyword",
          size: 10000
        }
      }
    }
  }

  const { data: dataPartners, isLoading: isLoadingPartners } = useQuery({
    queryKey: ['fundings-international-partners', selectedStructure, selectedYearEnd, selectedYearStart],
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

  const data = dataPartners.aggregations?.by_gps?.buckets
    .map((bucket) => ({
      lat: parseInt(bucket.key.split("_")[0]),
      lon: parseInt(bucket.key.split("_")[1]),
      name: getLabelFromGps(bucket.key),
      z: bucket.doc_count,
    }));

  const config = {
    id: "internationalPartnersByStructure",
    integrationURL: "/integration?chart_id=internationalPartnersByStructure",
  };

  const options = {
    ...getGeneralOptions('', [], '', ''),
    chart: { backgroundColor: 'transparent', margin: 0 },
    legend: { enabled: false },
    mapView: { padding: [20, 0, 0, 0] },
    series: [
      {
        name: mapData.title || 'France',
        mapData,
      }, {
        type: 'mapbubble',
        mapData,
        name: 'Nombre de projets communs',
        data,
        tooltip: {
          pointFormat: `<b>${getLabelFromName(selectedStructure)}</b> et <b>{point.name}</b> ont collaboré sur <b>{point.z} projet(s)</b> sur la période <b>${selectedYearStart}-${selectedYearEnd}</b>`
        }
      }
    ],
    title: { text: "" }
  };

  return (
    <div className={`chart-container chart-container--${color}`} id="international-partners-by-structure">
      <Title as="h3" look="h6">
        {`Partenaires internationaux de la structure ${getLabelFromName(selectedStructure)} sur la période ${selectedYearStart}-${selectedYearEnd}`}
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

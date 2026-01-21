import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { deepMerge, getEsQuery, getGeneralOptions, getYearRangeLabel } from "../../../../utils.ts";

import "highcharts/modules/map";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function FrenchPartnersByStructure({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const color = useChartColor();

  const { data: mapData, isLoading: isLoadingTopology } = useQuery({
    queryKey: ['topo-fr'],
    queryFn: () => fetch('https://code.highcharts.com/mapdata/countries/fr/fr-all.topo.json').then((response) => response.json()),
  });

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    aggregations: {
      by_gps: {
        terms: {
          field: "address.gps_id_name.keyword",
          size: 10000
        }
      }
    }
  }

  const { data: dataPartners, isLoading: isLoadingPartners } = useQuery({
    queryKey: ['fundings-french-partners', structure, yearMax, yearMin],
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
      name: bucket.key.split("###")[1],
      z: bucket.doc_count,
    }));

  const config = {
    id: "frenchPartnersByStructure",
    integrationURL: "/integration?chart_id=frenchPartnersByStructure",
    title: `Partenaires français de la structure ${name} ${getYearRangeLabel({ yearMax, yearMin })}`,
  };

  const localOptions = {
    mapView: { padding: [20, 0, 0, 0] },
    series: [
      {
        name: mapData.title || "France",
        mapData,
      }, {
        type: "mapbubble",
        mapData,
        name: "Nombre de projets communs",
        data,
        tooltip: {
          pointFormat: `<b>${name}</b> et <b>{point.name}</b> ont collaboré sur <b>{point.z} projet(s)</b> ${getYearRangeLabel({ isBold: true, yearMax, yearMin })}`,
        },
      }
    ],
  };
  const options: object = deepMerge(getGeneralOptions("", [], "", ""), localOptions);

  return (
    <div className={`chart-container chart-container--${color}`} id="french-partners-by-structure">
      <ChartWrapper config={config} constructorType="mapChart" options={options} />
    </div>
  );
};
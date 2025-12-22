import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getGeneralOptions } from "../../../../utils";
import { getIdFromName, getLabelFromName, getYears } from "../../../../utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopCountyByStructures() {
  const [selectedStructureId, setSelectedStructureId] = useState<string>("180089013###FR_Centre national de la recherche scientifique|||EN_French National Centre for Scientific Research");
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
              "co_partners_fr_inst.keyword": selectedStructureId
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
    queryKey: ['fundings-top-county', selectedStructureId, selectedYearEnd, selectedYearStart],
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

  const bodyStructures = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            term: {
              participant_isFrench: true
            }
          },
          {
            term: {
              participant_status: "active"
            }
          }
        ]
      }
    },
    aggregations: {
      by_structure: {
        terms: {
          field: "participant_id_name.keyword",
          size: 100
        }
      }
    }
  }

  const { data: dataStructures, isLoading: isLoadingStructures } = useQuery({
    queryKey: [`fundings-structures`, selectedYearEnd, selectedYearStart],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-participations`, {
        body: JSON.stringify(bodyStructures),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  if (isLoadingTopology || !topology || isLoadingCounty || !dataCounty || isLoadingStructures || !dataStructures) return <DefaultSkeleton />;

  const data = dataCounty.aggregations.by_county.buckets.map((bucket) => {
    let county = bucket.key;
    if (county === 'Guyane') county = 'Guyane française';
    if (county === "Provence-Alpes-Côte d'Azur") county = "Provence-Alpes-Côte-d'Azur";
    const county_id = topology.objects.default.geometries.find((item) => item.properties.name === county)?.properties?.['hc-key'];
    return [county_id, bucket.doc_count]
  });

  const structures = dataStructures.aggregations.by_structure.buckets.map((structure) => ({ id: getIdFromName(structure.key), key: structure.key, name: getLabelFromName(structure.key) }));

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

  const years = getYears();

  return (
    <div className={`chart-container chart-container--${color}`} id="top-county-by-structure">
      <Row gutters className="form-row">
        <Col md={12}>
          <select
            name="fundings-structure"
            id="fundings-structure"
            className="fr-mb-2w fr-select"
            value={selectedStructureId}
            onChange={(e) => setSelectedStructureId(e.target.value)}
          >
            <option disabled value="">Sélectionnez une structure</option>
            {structures.map((structure) => (
              <option key={structure.key} value={structure.key}>
                {structure.name}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <Row gutters className="form-row">
        <Col md={6}>
          <select
            name="fundings-year-start"
            id="fundings-year-start"
            className="fr-mb-2w fr-select"
            value={selectedYearStart}
            onChange={(e) => setSelectedYearStart(e.target.value)}
          >
            <option disabled value="">Sélectionnez une année de début</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Col>
        <Col md={6}>
          <select
            name="fundings-year-end"
            id="fundings-year-end"
            className="fr-mb-2w fr-select"
            value={selectedYearEnd}
            onChange={(e) => setSelectedYearEnd(e.target.value)}
          >
            <option disabled value="">Sélectionnez une année de fin</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={"mapChart"}
      />
    </div>
  );
};

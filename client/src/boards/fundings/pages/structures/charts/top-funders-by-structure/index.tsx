import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { getGeneralOptions, getIdFromName, getLabelFromName, getYears } from "../../../../utils.ts";
import { getCategoriesAndSeries } from "./utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopFundersByStructure() {
  const [selectedStructureId, setSelectedStructureId] = useState<string>("180089013");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const color = useChartColor();

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
              participant_type: "institution"
            }
          },
          {
            term: {
              "participant_id.keyword": selectedStructureId
            }
          }
        ]
      }
    },
    aggs: {
      by_funder_type: {
        terms: {
          field: "project_type.keyword",
          size: 25
        },
        aggs: {
          unique_projects: {
            cardinality: {
              field: "project_id.keyword"
            }
          }
        }
      }
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: [`fundings-top-funders-by-structure`, selectedStructureId, selectedYearEnd, selectedYearStart],
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

  if (isLoading || isLoadingStructures || !data || !dataStructures) return <DefaultSkeleton />;

  const structures = dataStructures.aggregations.by_structure.buckets.map((structure) => ({ id: getIdFromName(structure.key), name: getLabelFromName(structure.key) }));
  const { categories, series } = getCategoriesAndSeries(data);

  const getNameFromId = (structureId: string): string => structures.find((item) => item.id === structureId).name;

  const config = {
    id: "topFundersByStructure",
    integrationURL: "/integration?chart_id=topFundersByStructure",
    title: `Top 25 financeurs pour ${getNameFromId(selectedStructureId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = {
    ...getGeneralOptions(
      '',
      categories,
      '',
      'Nombre de projets financés'
    ),
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },
      },
    },
    series: [{ data: series }],
    tooltip: {
      format: `<b>{point.name}</b> a financé <b>{point.y}</b> projet(s) auquel(s) prend part ${getNameFromId(selectedStructureId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
    },
  }

  const years = getYears();

  return (
    <div className={`chart-container chart-container--${color}`} id="top-funders-by-structure">
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
              <option key={structure.id} value={structure.id}>
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
      <ChartWrapper
        config={config}
        legend={null}
        options={options}
      />
    </div>
  );
}

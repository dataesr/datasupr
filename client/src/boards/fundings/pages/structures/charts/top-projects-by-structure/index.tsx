import { Col, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper/index.tsx";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { useChartColor } from "../../../../../../hooks/useChartColor.tsx";
import { formatCompactNumber, getGeneralOptions, getIdFromName, getLabelFromName, getYears } from "../../../../utils";
import { getCategoriesAndSeries } from "./utils.ts";

const { VITE_APP_SERVER_URL } = import.meta.env;


export default function TopProjectsByStructure() {
  const [selectedStructureId, setSelectedStructureId] = useState<string>("180089013");
  const [selectedYearEnd, setSelectedYearEnd] = useState<string>("2024");
  const [selectedYearStart, setSelectedYearStart] = useState<string>("2022");
  const color = useChartColor();

  const body = {
    size: 25,
    query: {
      bool: {
        filter: [
          {
            range: {
              year: {
                gte: selectedYearStart,
                lte: selectedYearEnd
              }
            }
          },
          {
            term: {
              "participants.structure.id.keyword": selectedStructureId
            }
          }
        ]
      }
    },
    sort: [
      {
        budgetTotal: { order: "desc" }
      }
    ]
  }

  const { data, isLoading } = useQuery({
    queryKey: [`fundings-top-projects-by-structure`, selectedStructureId, selectedYearEnd, selectedYearStart],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=scanr-projects`, {
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
          },
          {
            term: {
              participant_type: "institution"
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
    id: "topProjectsByStructure",
    integrationURL: "/integration?chart_id=topProjectsByStructure",
    title: `Top 25 projets pour ${getNameFromId(selectedStructureId)} sur la période ${selectedYearStart}-${selectedYearEnd}`,
  };

  const options: object = {
    ...getGeneralOptions(
      '',
      categories,
      '',
      'Budget total'
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
      formatter: function (this: any) {
        return `${getNameFromId(selectedStructureId)} a participé au projet <b>${this.point.name}</b> financé à hauteur de <b>${formatCompactNumber(this.point.y)} €</b> par ${this.point.type}.`
      },
    },
  };

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

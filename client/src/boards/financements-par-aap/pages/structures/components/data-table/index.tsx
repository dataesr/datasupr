import { Col, Row, Spinner } from "@dataesr/dsfr-plus";
import { Grid, type GridOptions } from "@highcharts/grid-lite-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getEsQuery } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function DataTable() {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const [options, setOptions] = useState<GridOptions>({});

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    size: 10000,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["funding-data", structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  if (!isLoading && (options?.dataTable?.columns ?? []).length === 0) {
    let projectYear = [];
    let projectType = [];
    let projectId = [];
    let projectLabel = [];
    let projectInstrument = [];
    let participationIsCoordinator = [];
    let projectBudgetFinanced = [];
    let participationFunding = [];
    (data?.hits?.hits ?? []).forEach((hit) => {
      projectYear = projectYear.concat(hit._source?.project_year ?? '');
      projectType = projectType.concat(hit._source?.project_type ?? '');
      projectId = projectId.concat(hit._source?.project_id ?? '');
      projectLabel = projectLabel.concat(hit._source?.project_label ?? '');
      projectInstrument = projectInstrument.concat(hit._source?.project_instrument ?? '');
      participationIsCoordinator = participationIsCoordinator.concat(hit._source?.participation_is_coordinator ?? '');
      projectBudgetFinanced = projectBudgetFinanced.concat(hit._source?.project_budgetFinanced ?? '');
      participationFunding = participationFunding.concat(hit._source?.participation_funding ?? '');
    });

    setOptions({
      dataTable: {
        columns: {
          projectYear,
          projectType,
          projectId,
          projectLabel,
          projectInstrument,
          participationIsCoordinator,
          projectBudgetFinanced,
          participationFunding,
        }
      },
      columnDefaults: {
        sorting: { enabled: false },
      },
      columns: [{
        id: "projectYear",
        header: { format: "Année du projet" },
        sorting: { enabled: true },
      }, {
        id: "projectType",
        header: { format: "Type de projet" },
        sorting: { enabled: true },
        }, {
          id: "projectId",
          header: { format: "Identifiant du projet" },
        }, {
          id: "projectLabel",
          header: { format: "Nom du projet" },
        }, {
        id: "projectInstrument",
        header: { format: "Instrument de financement" },
        sorting: { enabled: true },
        }, {
          id: "participationIsCoordinator",
          header: { format: "Coordinateur" },
        }, {
        id: "projectBudgetFinanced",
        header: { format: "Financement global (présence)" },
        sorting: { enabled: true },
      }, {
        id: "participationFunding",
        header: { format: "Financement perçu (implication)" },
        sorting: { enabled: true },
      }],
      rendering: {
        columns: { resizing: { enabled: false } },
        rows: { minVisibleRows: 10 },
      }
    });
  };

  return (
    <Row gutters style={{ clear: "both" }}>
      <Col>
        <>
          {isLoading ? <Spinner /> : <Grid options={options} />}
        </>
      </Col>
    </Row>
  );
};

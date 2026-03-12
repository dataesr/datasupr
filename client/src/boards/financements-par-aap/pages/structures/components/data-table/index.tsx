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
    const hits = data?.hits?.hits ?? [];
    const projectYear = hits.map((hit) => hit._source?.project_year ?? '');
    const projectType = hits.map((hit) => hit._source?.project_type ?? '')
    const projectId = hits.map((hit) => hit._source?.project_id ?? '');
    const projectLabel = hits.map((hit) => hit._source?.project_label ?? '');
    const projectInstrument = hits.map((hit) => hit._source?.project_instrument ?? '');
    const participationIsCoordinator = hits.map((hit) => hit._source?.participation_is_coordinator ?? '');
    const projectBudgetFinanced = hits.map((hit) => hit._source?.project_budgetFinanced ?? '');
    const participationFunding = hits.map((hit) => hit._source?.participation_funding ?? '');

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
          {isLoading ? <Spinner /> : <Grid options={options} gridRef={gridRef} />}
        </>
      </Col>
    </Row>
  );
};

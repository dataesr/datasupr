import { Button, Col, Row, Spinner } from "@dataesr/dsfr-plus";
import { Grid, type GridOptions } from "@highcharts/grid-pro-react";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getEsQuery } from "../../../../utils.ts";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function DataTable({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const [options, setOptions] = useState<GridOptions>({});
  const gridRef = useRef(null);

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
    let projectYear: any[] = [];
    let projectType: any[] = [];
    let projectId: any[] = [];
    let projectLabel: any[] = [];
    let projectInstrument: any[] = [];
    let participationIsCoordinator: any[] = [];
    let projectBudgetFinanced: any[] = [];
    let participationFunding: any[] = [];
    (data?.hits?.hits ?? []).forEach((hit: any) => {
      projectYear.push(hit._source?.project_year ?? '');
      projectType.push(hit._source?.project_type ?? '');
      projectId.push(hit._source?.project_id ?? '');
      projectLabel.push(hit._source?.project_label ?? '');
      projectInstrument.push(hit._source?.project_instrument ?? '');
      participationIsCoordinator.push(hit._source?.participation_is_coordinator ?? '');
      projectBudgetFinanced.push(hit._source?.project_budgetFinanced ?? '');
      participationFunding.push(hit._source?.participation_funding ?? '');
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
        filtering: { enabled: true },
        header: { format: "Année du projet" },
        id: "projectYear",
        sorting: { enabled: true },
      }, {
        filtering: { enabled: true },
        header: { format: "Type de projet" },
        id: "projectType",
        sorting: { enabled: true },
      }, {
        header: { format: "Identifiant du projet" },
        id: "projectId",
      }, {
        header: { format: "Nom du projet" },
        id: "projectLabel",
      }, {
        header: { format: "Instrument de financement" },
        id: "projectInstrument",
        sorting: { enabled: true },
      }, {
        filtering: { enabled: true },
        header: { format: "Coordinateur" },
        id: "participationIsCoordinator",
      }, {
        header: { format: "Financement global (présence)" },
        id: "projectBudgetFinanced",
        sorting: { enabled: true },
      }, {
        header: { format: "Financement perçu (implication)" },
        id: "participationFunding",
        sorting: { enabled: true },
      }],
      credits: { enabled: false },
      exporting: {
        filename: `tableaux_financements_par_aap_${name?.toLowerCase().replace(/[-,'’\s]/g, '_')}`,
      },
      rendering: {
        columns: { resizing: { enabled: false } },
        rows: { minVisibleRows: 50 },
      }
    });
  };

  const downloadCsv = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Use the bracket notation to suppress the error "Property 'grid' does not exist on type 'never'."
    if (gridRef?.current?.['grid']) {
      const currentGrid: any = gridRef?.current['grid'];
      currentGrid.grid.exporting.downloadCSV();
    }
  };

  return (
    <Row gutters style={{ clear: "both" }}>
      <Col>
        <>
          <Button className="fr-mb-2w" onClick={(e) => downloadCsv(e)}>
            Export CSV
          </Button>
          {isLoading ? <Spinner /> : <Grid options={options} gridRef={gridRef} />}
          <Button className="fr-mt-2w" onClick={(e) => downloadCsv(e)}>
            Export CSV
          </Button>
        </>
      </Col>
    </Row>
  );
};

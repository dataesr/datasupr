import { Button, Col, Row } from "@dataesr/dsfr-plus";
import { Grid, type GridOptions } from "@highcharts/grid-pro-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getEsQuery } from "../../../../utils.ts";

import "./styles.scss";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function DataTable({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");
  const [options, setOptions] = useState<GridOptions>({
    data: {
      providerType: 'remote',
      fetchCallback: async () => {
        const response = await fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
          body: JSON.stringify({
            ...getEsQuery({ structures: [structure], yearMax, yearMin }),
            size: 10000,
          }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
        });
        const results = await response.json();

        let projectYear: any[] = [];
        let projectType: any[] = [];
        let projectId: any[] = [];
        let projectLabel: any[] = [];
        let projectInstrument: any[] = [];
        let participationIsCoordinator: any[] = [];
        let projectBudgetFinanced: any[] = [];
        let participationFunding: any[] = [];
        (results?.hits?.hits ?? []).forEach((hit: any) => {
          projectYear.push(hit._source?.project_year ?? '');
          projectType.push(hit._source?.project_type ?? '');
          projectId.push(hit._source?.project_id ?? '');
          projectLabel.push(hit._source?.project_label ?? '');
          projectInstrument.push(hit._source?.project_instrument ?? '');
          participationIsCoordinator.push(hit._source?.participation_is_coordinator ?? '');
          projectBudgetFinanced.push(hit._source?.project_budgetFinanced ?? '');
          participationFunding.push(hit._source?.participation_funding ?? '');
        });
        return {
          columns: {
            projectYear,
            projectType,
            projectId,
            projectLabel,
            projectInstrument,
            participationIsCoordinator,
            projectBudgetFinanced,
            participationFunding,
          },
          totalRowCount: projectYear.length,
          rowIds: projectId,
        };
      },
    },
    columnDefaults: {
      sorting: { enabled: false },
    },
    columns: [{
      filtering: { enabled: true },
      cells: { format: '{value}' },
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
      width: 300
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
      cells: { formatter: function() { return String(this.value).length > 0 ? `${this.value} €` : ''; }  },
      id: "projectBudgetFinanced",
      sorting: { enabled: true },
    }, {
      header: { format: "Financement perçu (implication)" },
      cells: { formatter: function() { return String(this.value).length > 0 ? `${this.value} €` : ''; } },
      id: "participationFunding",
      sorting: { enabled: true },
    }],
    credits: { enabled: false },
    exporting: {
      filename: `tableaux_financements_par_aap_${name?.toLowerCase().replace(/[-,'’\s]/g, '_')}`,
    },
    rendering: {
      columns: { resizing: { enabled: false } },
      theme: 'hcg-theme-default theme-tableaux',
      rows: { minVisibleRows: 50 },
    },
  });
  const gridRef = useRef(null);

  // Reload data
  useEffect(() => {
    setOptions({ ...options });
  }, [yearMax, yearMin]);

  const downloadCsv = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Use the bracket notation to suppress the error "Property 'grid' does not exist on type 'never'."
    if (gridRef?.current?.['grid']) {
      const currentGrid: any = gridRef?.current['grid'];
      currentGrid.exporting.downloadCSV();
    }
  };

  return (
    <Row gutters style={{ clear: "both" }}>
      <Col>
        <>
          <Button className="fr-mb-2w" onClick={(e) => downloadCsv(e)}>
            Export CSV
          </Button>
          <Grid gridRef={gridRef} options={options} />
          <Button className="fr-mt-2w" onClick={(e) => downloadCsv(e)}>
            Export CSV
          </Button>
        </>
      </Col>
    </Row>
  );
};

import { Button, Col, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../../../components/charts-skeletons/default.tsx";
import { getEsQuery } from "../../../../utils.ts";
import DataTable from "./datatable.tsx";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

type Column = {
  id: string
  isSortable: boolean
  label: string
}

type Filter = {
  id: string
  value: string
}

type Project = {
  id: string
  instrument: string
  label: string
  participationFunding: number
  participationIsCoordinator: boolean
  projectBudgetFinanced: number
  type: string
  year: number
}

type Sort = {
  id: string
  order: 'asc' | 'desc'
}

export default function ProjectsData({ name }: { name: string | undefined }) {
  const [searchParams] = useSearchParams()
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax");
  const yearMin = searchParams.get("yearMin");

  const [filters, setFilters] = useState<Filter[]>([])
  const [pagination, setPagination] = useState({ from: 0, size: 10 })
  const [sorting, setSorting] = useState<Sort>();

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    from: pagination?.from ?? 0,
    size: pagination?.size ?? 10,
  }

  if (sorting?.id) {
    body.sort = { [sorting.id]: sorting.order }
  }
  if (filters.length > 0) {
    filters.forEach((filter) => {
      if (filter.id === 'year') {
        body.query.bool.filter.push({ term: { project_year: filter.value } })
      } else if (filter.id === 'type') {
        body.query.bool.filter.push({ wildcard: { 'project_type.keyword': `*${filter.value}*` } })
      } else {
        console.error(`Filter id not supported : ${filter.id}`)
      }
    })
  }

  const { data, isLoading } = useQuery({
    queryKey: ["fundings-data", filters, pagination, sorting, structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  const dataTable: Project[] = (data?.hits?.hits ?? []).map((hit) => ({
    id: hit._source?.project_id,
    instrument: hit._source?.project_instrument,
    label: hit._source?.project_label,
    participationFunding: hit._source?.participation_funding,
    participationIsCoordinator: hit._source?.participation_is_coordinator.toString(),
    projectBudgetFinanced: hit._source?.project_budgetFinanced,
    type: hit._source?.project_type,
    year: hit._source?.project_year,
  }))
  const numberOfResults = data?.hits?.total?.value ?? 0

  const columns = useMemo<Column[]>(() => [
    {
      id: 'year',
      isFilterable: true,
      isSortable: true,
      label: 'Année',
      sortableField: 'project_year',
    },
    {
      id: 'type',
      isFilterable: true,
      isSortable: true,
      label: 'Type',
      sortableField: 'project_type.keyword',
    },
    {
      id: 'id',
      isSortable: false,
      label: 'Identifiant',
    },
    {
      id: 'label',
      isSortable: false,
      label: 'Nom',
    },
    {
      id: 'instrument',
      isSortable: true,
      label: 'Instrument de financement',
      sortableField: 'project_instrument.keyword',
    },
    {
      id: 'participationIsCoordinator',
      isSortable: true,
      label: 'Coordinateur',
      sortableField: 'participation_is_coordinator',
    },
    {
      id: 'projectBudgetFinanced',
      isSortable: true,
      label: 'Financement global (présence)',
      sortableField: 'project_budgetFinanced',
    },
    {
      id: 'participationFunding',
      isSortable: true,
      label: 'Financement perçu (implication)',
      sortableField: 'participation_funding',
    }
  ], []);

  const downloadCsv = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dataTable.length > 0) {
      // Extract keys from the first object to use as headers
      const headers = Object.keys(dataTable[0]);
      const rows = dataTable.map(obj => headers.map(key => obj[key]));
      // Combine headers and rows into a single CSV string
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      // Create a hidden download link
      const link = document.createElement('a');
      link.download = `tableaux_financements_par_aap_${name}.csv`;
      link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8' }));
      link.style.visibility = 'hidden';
      // Append link to DOM, trigger click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) return <DefaultSkeleton height="600px" />

  return (
    <>
      <Row className="fr-grid-row--middle fr-mb-3w">
        <Col>
          <Title as="h2" look="h4">Données détaillées</Title>
          <Text className="fr-text--sm fr-mb-0" style={{ color: "var(--text-mention-grey)" }}>
            Liste des participations aux projets financés pour la période sélectionnée
          </Text>
        </Col>
        <Col style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            icon="download-line"
            iconPosition="left"
            onClick={(e) => downloadCsv(e)}
            size="sm"
            variant="secondary"
          >
            Télécharger en CSV
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            columns={columns}
            dataTable={dataTable}
            filters={filters}
            numberOfResults={numberOfResults}
            pagination={pagination}
            setFilters={setFilters}
            setPagination={setPagination}
            setSorting={setSorting}
            sorting={sorting}
          />
        </Col>
      </Row>
    </>
  )
}

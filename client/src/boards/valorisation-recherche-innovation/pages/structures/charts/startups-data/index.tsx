import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import DefaultSkeleton from '../../../../../../components/charts-skeletons/default.tsx'
import { getEsQueryStartups } from '../../../../utils.ts'
import DataTable from './datatable.tsx'

const { VITE_APP_ES_INDEX_ORGANIZATIONS, VITE_APP_SERVER_URL } = import.meta.env;

type Column = {
  id: string
  isSortable: boolean
  label: string
}

type Filter = {
  id: string
  value: string
}

type StartUps = {
  acronym: string
  county: string
  creationYear: number
  label: string
  status: number
  website: 'active' | 'old'
}

type Sort = {
  id: string
  order: 'asc' | 'desc'
}

export default function StartupsData() {
  const [searchParams] = useSearchParams()
  const structure = searchParams.get('structure')
  const yearMax = searchParams.get('yearMax')
  const yearMin = searchParams.get('yearMin')

  const [filters, setFilters] = useState<Filter[]>([])
  const [sorting, setSorting] = useState<Sort>()

  const body = {
    ...getEsQueryStartups({ structures: [structure], yearMax, yearMin }),
    size: 100,
  }

  if (sorting?.id) {
    const sortField = sorting.id
    let esSortField = sortField
    switch (sortField) {
      case 'creationYear':
        esSortField = 'creationYear'
        break
      case 'county':
        esSortField = 'address.region.keyword'
        break
      case 'status':
        esSortField = 'status.keyword'
        break
      default:
        break;
    }
    body.sort = { [esSortField]: sorting.order }
  }
  if (filters.length > 0) {
    filters.forEach((filter) => {
      if (filter.id === 'label') {
        body.query.bool.filter.push({ wildcard: { 'label.fr.keyword': `*${filter.value}*` } })
      }
      if (filter.id === 'acronym') {
        body.query.bool.filter.push({ wildcard: { 'acronym.fr.keyword': `*${filter.value}*` } })
      }
      if (filter.id === 'county') {
        body.query.bool.filter.push({ wildcard: { 'address.region.keyword': `*${filter.value}*` } })
      }
      if (filter.id === 'creationYear') {
        body.query.bool.filter.push({ term: { creationYear: filter.value } })
      }
      if (filter.id === 'status') {
        body.query.bool.filter.push({ term: { status: filter.value } })
      }
    })
  }

  const { data, isLoading } = useQuery({
    queryKey: ["valo-startups-data", sorting, structure, yearMax, yearMin, filters],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_ORGANIZATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  })

  const dataTable: StartUps[] = (data?.hits?.hits ?? []).map((hit) => ({
    acronym: hit._source?.acronym?.fr ?? hit?._source?.acronym?.default ?? '',
    county: hit._source?.address?.map((item) => item?.region).join(',') ?? '',
    creationYear: hit._source?.creationYear ?? '',
    id: hit._source.id,
    label: hit._source?.label?.fr ?? hit?._source?.label?.default ?? '',
    status: hit._source?.status ?? '',
    website: hit._source?.links?.[0]?.url ?? '',
  }))

  const columns = useMemo<Column[]>(() => [
    {
      id: 'label',
      isFilterable: true,
      isSortable: false,
      label: 'Label',
      meta: { filterVariant: 'text' },
    },
    {
      id: 'acronym',
      isFilterable: true,
      isSortable: false,
      label: 'Acronyme',
      meta: { filterVariant: 'text' },
    },
    {
      getCellValue: (row) => row?.website ? <a href={row.website} target="_blank">{row.website}</a> : '',
      id: 'website',
      isSortable: false,
      label: 'Site web',
    },
    {
      id: 'county',
      isFilterable: true,
      isSortable: true,
      label: 'Région',
    },
    {
      id: 'creationYear',
      isFilterable: true,
      isSortable: true,
      label: 'Année de création',
      meta: { filterVariant: 'range' },
    },
    {
      id: 'status',
      isFilterable: true,
      isSortable: true,
      label: 'Statut',
      meta: { filterVariant: 'select' },
    },
  ], [])

  if (isLoading) return <DefaultSkeleton height="600px" />

  return <DataTable
    columns={columns}
    dataTable={dataTable}
    filters={filters}
    setFilters={setFilters}
    setSorting={setSorting}
    sorting={sorting}
  />
}

import { useQuery } from '@tanstack/react-query'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import DefaultSkeleton from '../../../../../../components/charts-skeletons/default.tsx'
import { getEsQueryStartups } from '../../../../utils.ts'
import DataTable from './datatable.tsx'

const { VITE_APP_ES_INDEX_ORGANIZATIONS, VITE_APP_SERVER_URL } = import.meta.env;

type StartUps = {
  acronym: string
  county: string
  creationYear: number
  label: string
  status: number
  website: 'active' | 'old'
}

export default function StartupsData() {
  const [searchParams] = useSearchParams()
  const structure = searchParams.get('structure')
  const yearMax = searchParams.get('yearMax')
  const yearMin = searchParams.get('yearMin')

  const [sorting, setSorting] = useState<SortingState>([])

  const body = {
    ...getEsQueryStartups({ structures: [structure], yearMax, yearMin }),
    size: 100,
  }
  if (sorting.length > 0) {
    const sortField = sorting[0].id
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
    body.sort = { [esSortField]: sorting[0].desc ? 'desc' : 'asc' }
  }
  const { data, isLoading } = useQuery({
    queryKey: ["valo-startups-data", sorting, structure, yearMax, yearMin],
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
    acronym: hit?._source?.acronym?.fr ?? hit?._source?.acronym?.default ?? '',
    county: hit?._source?.address?.map((item) => item?.region).join(',') ?? '',
    creationYear: hit?._source?.creationYear ?? '',
    label: hit?._source?.label?.fr ?? hit?._source?.label?.default ?? '',
    status: hit?._source?.status ?? '',
    website: hit?._source?.links?.[0]?.url ?? '',
  }))

  const columns = useMemo<ColumnDef<StartUps>[]>(() => [
    {
      accessorKey: 'label',
      enableSorting: false,
      header: 'Label',

    },
    {
      accessorKey: 'acronym',
      enableSorting: false,
      header: 'Acronyme',
    },
    {
      accessorKey: 'website',
      cell: (props: any) => props.getValue().length > 0 ? <a href={`${props.getValue()}`} target="_blank">{`${props.getValue()}`}</a> : '',
      enableSorting: false,
      header: 'Site web',
    },
    {
      accessorKey: 'county',
      enableMultiSort: false,
      header: 'Région',
    },
    {
      accessorKey: 'creationYear',
      enableMultiSort: false,
      header: 'Année de création',
    },
    {
      accessorKey: 'status',
      enableMultiSort: false,
      header: 'Statut',
    },
  ], [])

  if (isLoading) return <DefaultSkeleton height="600px" />

  return <DataTable columns={columns} dataTable={dataTable} setSorting={setSorting} sorting={sorting} />
}

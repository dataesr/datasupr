import { Column, flexRender, getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

import './datatable.scss'

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

export default function DataTable({ columns, columnFilters, dataTable, setColumnFilters, setSorting, sorting }) {
  // const table = useReactTable({
  //   columns,
  //   data: dataTable,
  //   filterFns: {},
  //   // getFilteredRowModel: getFilteredRowModel(), //client side filtering
  //   getCoreRowModel: getCoreRowModel(),
  //   onColumnFiltersChange: (props) => {
  //     return setColumnFilters(props)
  //   },
  //   onSortingChange: (props) => setSorting(props),
  //   state: { columnFilters, sorting },
  // })

  const getColumnIcon = (column) => {
    if (column.isSortable) {
      if (!sorting?.id) return <i className="ri-subtract-line fr-ml-1w" />
      if ((column.id === sorting?.id) && (sorting?.direction === 'asc')) return <i className="ri-sort-asc fr-ml-1w" />
      if ((column.id === sorting?.id) && (sorting?.direction === 'desc')) return <i className="ri-sort-desc fr-ml-1w" />
    }
    return ''
  }

  const handleSort = (column) => {
    if (column.isSortable) {
      if (column.id === sorting?.id) {
        if (sorting.direction === 'asc') {
          setSorting({ id: column.id, direction: 'desc' })
        } else {
          setSorting()
        }
      } else {
        setSorting({ id: column.id, direction: 'asc' })
      }
    }
  }

  function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta ?? {}

    return filterVariant === 'range' ? (
      <div>
        <div className="flex space-x-2">
          {/* See faceted column filters example for min max values functionality */}
          <DebouncedInput
            type="number"
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [value, old?.[1]])
            }
            placeholder={`Min`}
            className="w-24 border shadow rounded"
          />
          <DebouncedInput
            type="number"
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [old?.[0], value])
            }
            placeholder={`Max`}
            className="w-24 border shadow rounded"
          />
        </div>
        <div className="h-1" />
      </div>
    ) : filterVariant === 'select' ? (
      <select
        onChange={(e) => column.setFilterValue(e.target.value)}
        value={columnFilterValue?.toString()}
      >
        {/* See faceted column filters example for dynamic select options */}
        <option value="">All</option>
        <option value="active">active</option>
        <option value="old">old</option>
      </select>
    ) : (
      <DebouncedInput
        className="w-36 border shadow rounded"
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search...`}
        type="text"
        value={(columnFilterValue ?? '') as string}
      />
    )
  }

  // A typical debounced input react component
  function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return (
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  }

  return (
    <table className="valo-datatable">
      <thead>
        <tr>
          {columns.map((column) => {
            return (
              <th key={column.id}>
                {column.isPlaceholder ? null : (
                  <div
                    // className={
                    //   column.getCanSort()
                    //     ? 'cursor-pointer select-none'
                    //     : ''
                    // }
                    onClick={() => handleSort(column)}
                  >
                    {column.label}
                    {/* {flexRender(
                      column.column.columnDef.header,
                      column.getContext(),
                    )} */}
                    {/* {header.column.getCanFilter() ? <i className="ri-filter-2-line" /> : ''} */}
                    {/* {{
                      asc: <i className="ri-sort-asc fr-ml-1w" />,
                      desc: <i className="ri-sort-desc fr-ml-1w" />,
                    }[column.column.getIsSorted() as string] ?? (column.getCanSort() ? <i className="ri-subtract-line fr-ml-1w" /> : '')} */}
                    {column.isSortable ? (column.is === <i className="ri-subtract-line fr-ml-1w" />) : ''}
                    {getColumnIcon(column)}
                  </div>
                )}
                {/* {column.getCanFilter() ? (
                  <div>
                    <Filter column={column.column} />
                  </div>
                ) : null} */}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {dataTable.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={`${column.id}-${row.id}`}>
                {column.getCellValue ? column.getCellValue(row) : row?.[column?.id]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
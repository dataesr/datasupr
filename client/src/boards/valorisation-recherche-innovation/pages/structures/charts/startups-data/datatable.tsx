import { useEffect, useState } from 'react'

import { capitalize } from '../../../../../../utils/format'

import './datatable.scss'

export default function DataTable({ columns, dataTable, filters, setFilters, setSorting, sorting }) {
  const [inputLabel, setInputLabel] = useState(filters.find((filter) => filter.id === 'label')?.value ?? '')

  const getSortableIcon = (column) => {
    if (column.isSortable) {
      if (!sorting?.id) return <i className="ri-subtract-line" />
      if ((column.id === sorting?.id) && (sorting?.order === 'asc')) return <i className="ri-sort-asc" />
      if ((column.id === sorting?.id) && (sorting?.order === 'desc')) return <i className="ri-sort-desc" />
    }
    return ''
  }

  const handleSort = (column) => {
    if (column.isSortable) {
      if (column.id === sorting?.id) {
        if (sorting.order === 'asc') {
          setSorting({ id: column.id, order: 'desc' })
        } else {
          setSorting()
        }
      } else {
        setSorting({ id: column.id, order: 'asc' })
      }
    }
  }

  const handleInputLabelChange = (event) => setInputLabel(event.target.value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters([...filters.filter((filter) => filter.id !== "label"), { id: "label", value: inputLabel }])
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [inputLabel]);

  return (
    <table className="valo-datatable">
      <thead>
        <tr>
          {columns.map((column) => {
            return (
              <th key={column.id}>
                {column.isPlaceholder ? null : (
                  <>
                    <div onClick={() => handleSort(column)}>
                      {column.label}
                      {' '}
                      {column?.isFilterable && <i className="ri-filter-line"></i>}
                      {' '}
                      {getSortableIcon(column)}
                    </div>
                    {column?.isFilterable && (
                      <div>
                        <input
                          onChange={handleInputLabelChange}
                          type="text"
                          value={eval(`inputValue${capitalize(column.id)}`)}
                        />
                      </div>
                    )}
                  </>
                )}
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
import { useEffect, useState } from 'react'

import './datatable.scss'
import { Col, Row } from '@dataesr/dsfr-plus';

export default function DataTable({ columns, dataTable, filters, numberOfResults, pagination, setFilters, setPagination, setSorting, sorting }) {
  const inputsTmp = {}
  filters.forEach((filter) => {
    inputsTmp[filter.id] = filter.value
  });
  const [inputs, setInputs] = useState(inputsTmp)

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

  const handles = {
    label: (event) => setInputs({ ...inputs, label: event.target.value }),
    acronym: (event) => setInputs({ ...inputs, acronym: event.target.value }),
    county: (event) => setInputs({ ...inputs, county: event.target.value }),
    creationYear: (event) => setInputs({ ...inputs, creationYear: event.target.value }),
    status: (event) => setInputs({ ...inputs, status: event.target.value }),
  }

  const handleInputChange = (event, column) => handles[column.id](event)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(Object.keys(inputs).map((id) => ({ id, value: inputs[id] })).filter((filter) => filter.value.length > 0))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [inputs]);

  return (
    <>
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
                            onChange={(event) => handleInputChange(event, column)}
                            type="text"
                            value={inputs[column.id]}
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
      <Row className="fr-mt-1w">
        <Col>
          <button
            className="border rounded p-1"
            onClick={() => setPagination({ ...pagination, from: 0 })}
            disabled={pagination.from === 0}
          >
            <i className="ri-arrow-left-double-line" />
          </button>
          <button
            className="border rounded p-1"
            onClick={() => setPagination({ ...pagination, from: pagination.from - pagination.size })}
            disabled={pagination.from === 0}
          >
            <i className="ri-arrow-left-s-line" />
          </button>
          <span className="fr-mx-1w">
            Page
            {' '}
            <input
              className="border p-1 rounded w-16"
              defaultValue={1}
              max={Math.ceil(numberOfResults / pagination.size)}
              min="1"
              onChange={(e) => setPagination({ ...pagination, from: (Number(e.target.value) - 1) * pagination.size })}
              type="number"
              value={(pagination.from / pagination.size) + 1}
            />
            {' '}
            of
            {' '}
            <strong>
              {Math.ceil(numberOfResults / pagination.size)}
            </strong>
          </span>
          <button
            className="border rounded p-1"
            onClick={() => setPagination({ ...pagination, from: pagination.from + pagination.size })}
            disabled={(pagination.from / pagination.size) + 1 === Math.ceil(numberOfResults / pagination.size)}
          >
            <i className="ri-arrow-right-s-line" />
          </button>
          <button
            className="border rounded p-1"
            onClick={() => setPagination({ ...pagination, from: Math.floor(numberOfResults / pagination.size) * pagination.size })}
            disabled={(pagination.from / pagination.size) + 1 === Math.ceil(numberOfResults / pagination.size)}
          >
            <i className="ri-arrow-right-double-line" />
          </button>
        </Col>
        <Col>
          <select
            value={pagination.size}
            onChange={(e) => setPagination({ from: 0, size: Number(e.target.value) })}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} par page
              </option>
            ))}
          </select>
        </Col>
        <Col>
          <i>
            {numberOfResults} résultats
          </i>
        </Col>
      </Row>
    </>
  )
}
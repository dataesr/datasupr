import { Col, Row } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";

import "./style.scss";

export default function DataTable({ aggregations, columns, dataTable, filters, numberOfResults, pagination, setFilters, setPagination, setSorting, sorting }) {
  const inputsTmp = {}
  filters.forEach((filter) => {
    inputsTmp[filter.id] = filter.value
  });
  const [inputs, setInputs] = useState(inputsTmp)

  const getSortableIcon = (column) => {
    if (column.isSortable) {
      const id = column?.sortableField ?? column.id;
      if ((id === sorting?.id) && (sorting?.order === 'asc')) return (
        <button
          className="button-action border p-1 rounded"
          onClick={() => handleSort(column)}
        >
          <i className="ri-sort-asc" />
        </button>
      )
      if ((id === sorting?.id) && (sorting?.order === 'desc')) return (
        <button
          className="button-action border p-1 rounded"
          onClick={() => handleSort(column)}
        >
          <i className="ri-sort-desc" />
        </button>
      )
      else return (
        <button
          className="button-action border p-1 rounded"
          onClick={() => handleSort(column)}
        >
          <i className="ri-subtract-line" />
        </button>
      )
    }
    return ''
  }

  const handleSort = (column) => {
    if (column.isSortable) {
      const id = column?.sortableField ?? column.id;
      if (id === sorting?.id) {
        if (sorting.order === 'asc') {
          setSorting({ id, order: 'desc' })
        } else {
          setSorting()
        }
      } else {
        setSorting({ id, order: 'asc' })
      }
    }
  }

  const handleFilter = (column, event) => {
    if (event.target.value === '') {
      const { [column.id]: _, ...rest } = inputs as any;
      setInputs(rest);
    } else {
      setInputs({ ...inputs, [column.id]: event.target.value });
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(Object.keys(inputs).map((id) => ({ id, value: inputs[id] })).filter((filter) => filter.value.length > 0))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [inputs]);

  return (
    <>
      <table className="fundings-datatable">
        <thead>
          <tr>
            {columns.map((column) => {
              return (
                <th key={column.id}>
                  {column.isPlaceholder ? null : (
                    <>
                      <div>
                        {column?.label ?? column.id}
                        {' '}
                        {column?.isFilterable && <i className="ri-filter-line" />}
                        {' '}
                        {getSortableIcon(column)}
                      </div>
                      {column?.isFilterable && (
                        column?.isFilterableBySelect && aggregations?.[column.id] ? (
                          <select
                            name={`fundings-structure-data-${column.id}`}
                            id={`fundings-structure-data-${column.id}`}
                            className="fr-mb-2w fr-select"
                            value={inputs[column.id]}
                            onChange={(event) => handleFilter(column, event)}
                          >
                            <option key='all' value=''>
                              Tout
                            </option>
                            {(aggregations?.[column.id]?.buckets ?? []).map((bucket) => (
                              <option key={bucket.key} value={bucket.key}>
                                {bucket.key} ({bucket.doc_count})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            <input
                              className="border"
                              onChange={(event) => handleFilter(column, event)}
                              type="text"
                              value={inputs[column.id]}
                            />
                          </div>
                        )
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
            <tr key={row.uniqId}>
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
          <select
            className="button-action"
            onChange={(e) => setPagination({ from: 0, size: Number(e.target.value) })}
            value={pagination.size}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          résultats par page
        </Col>
        <Col style={{ textAlign: 'center' }}>
          <button
            className="button-action border p-1 rounded"
            onClick={() => setPagination({ ...pagination, from: 0 })}
            disabled={pagination.from === 0}
          >
            <i className="ri-arrow-left-double-line" />
          </button>
          <button
            className="button-action border p-1 rounded"
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
            className="button-action border p-1 rounded"
            onClick={() => setPagination({ ...pagination, from: pagination.from + pagination.size })}
            disabled={(pagination.from / pagination.size) + 1 === Math.ceil(numberOfResults / pagination.size)}
          >
            <i className="ri-arrow-right-s-line" />
          </button>
          <button
            className="button-action border p-1 rounded"
            onClick={() => setPagination({ ...pagination, from: Math.floor(numberOfResults / pagination.size) * pagination.size })}
            disabled={(pagination.from / pagination.size) + 1 === Math.ceil(numberOfResults / pagination.size)}
          >
            <i className="ri-arrow-right-double-line" />
          </button>
        </Col>
        <Col style={{ textAlign: 'right' }}>
          <i>
            Résultats {pagination.from + 1} - {Math.min(pagination.from + pagination.size, numberOfResults)} / {numberOfResults}
          </i>
        </Col>
      </Row>
    </>
  )
}
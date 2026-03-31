import './datatable.scss'

export default function DataTable({ columns, dataTable, setSorting, sorting }) {
  const getColumnIcon = (column) => {
    if (column.isSortable) {
      if (!sorting?.id) return <i className="ri-subtract-line" />
      if ((column.id === sorting?.id) && (sorting?.direction === 'asc')) return <i className="ri-sort-asc" />
      if ((column.id === sorting?.id) && (sorting?.direction === 'desc')) return <i className="ri-sort-desc" />
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

  return (
    <table className="valo-datatable">
      <thead>
        <tr>
          {columns.map((column) => {
            return (
              <th key={column.id}>
                {column.isPlaceholder ? null : (
                  <div onClick={() => handleSort(column)}>
                    {column.label}
                    {' '}
                    {getColumnIcon(column)}
                  </div>
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
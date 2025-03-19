function TableWrapper({ children }) {
  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="table-bordered">{children}</table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RenderData(options) {
  return (
    <TableWrapper>
      <thead>
        <tr>
          <th>Id des partenaires</th>
          <th>Liste des partenaires</th>
          <th>Nombre de projets communs</th>
          <th>Pays</th>
        </tr>
      </thead>
      <tbody>
        {options.series[0].data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.country}</td>
          </tr>
        ))}
      </tbody>
    </TableWrapper>
  );
}

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

export function RenderDataSubsidiesValues(options) {
  return (
    <TableWrapper>
      <thead>
        <tr>
          <th>Piliers</th>
          {options.xAxis[0].categories.map((year) => (
            <th key={year}>{year}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {options.series.map((item) => (
          <tr>
            <td>{`${options.xAxis[item.xAxis === 1 ? 1 : 0].title.text}, ${
              item.name
            }`}</td>
            {item.data.map((value, index) => (
              <td key={index}>{value.toFixed(2)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </TableWrapper>
  );
}

// export function RenderDataSubsidiesRates(options) {
//   return (
//     <TableWrapper>
//       <thead>
//         <tr>
//           <th>Piliers</th>
//           <th>{options.series[0].name}</th>
//           <th>{options.series[1].name}</th>
//         </tr>
//       </thead>
//       <tbody>
//         {options.series[0].data.map((_, index) => (
//           <tr key={index}>
//             <td>{options.xAxis.categories[index]}</td>
//             <td>{`${options.series[0].data[index].toFixed(2)} %`}</td>
//             <td>{`${options.series[1].data[index].toFixed(2)} %`}</td>
//           </tr>
//         ))}
//       </tbody>
//     </TableWrapper>
//   );
// }

// export function RenderDataCoordinationNumberValues(options) {
//   return (
//     <TableWrapper>
//       <thead>
//         <tr>
//           <th>Piliers</th>
//           <th>{options.series[0].name}</th>
//           <th>{options.series[1].name}</th>
//         </tr>
//       </thead>
//       <tbody>
//         {options.series[0].data.map((_, index) => (
//           <tr key={index}>
//             <td>{options.xAxis.categories[index]}</td>
//             <td>{`${options.series[0].data[index]}`}</td>
//             <td>{`${options.series[1].data[index]}`}</td>
//           </tr>
//         ))}
//       </tbody>
//     </TableWrapper>
//   );
// }

// export function RenderDataCoordinationNumberRates(options) {
//   return (
//     <TableWrapper>
//       <thead>
//         <tr>
//           <th>Piliers</th>
//           <th>{options.series[0].name}</th>
//           <th>{options.series[1].name}</th>
//         </tr>
//       </thead>
//       <tbody>
//         {options.series[0].data.map((_, index) => (
//           <tr key={index}>
//             <td>{options.xAxis.categories[index]}</td>
//             <td>{`${options.series[0].data[index].toFixed(2)} %`}</td>
//             <td>{`${options.series[1].data[index].toFixed(2)} %`}</td>
//           </tr>
//         ))}
//       </tbody>
//     </TableWrapper>
//   );
// }

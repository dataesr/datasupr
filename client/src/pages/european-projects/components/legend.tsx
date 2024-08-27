export function GetLegend(legendArray: [string, string][]) {
  return (
    <ul className="legend">
      {legendArray.map((item) => (
        <li
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              background: item[1],
              marginRight: "10px",
            }}
          ></div>
          <span>{item[0]}</span>
        </li>
      ))}
    </ul>
  );
}

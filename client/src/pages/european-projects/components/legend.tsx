export function GetLegend(legendArray: [string, string][], legendId: string) {
  return (
    <ul className="legend">
      {legendArray.map((item) => (
        <li
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
          key={`${legendId}item[0]`}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              background: item[1],
              marginRight: "10px",
            }}
          />
          <span>{item[0]}</span>
        </li>
      ))}
    </ul>
  );
}

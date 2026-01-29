import { getI18nLabel } from "../../../utils";
import i18n from "../i18n-global.json";

export function GetLegend(legendArray: [string, string][], legendId: string, columns?: number) {
  const columnStyle = columns
    ? {
        columnCount: columns,
        columnGap: "20px",
      }
    : {};

  return (
    <fieldset className="legend">
      <legend>{getI18nLabel(i18n, "legend")}</legend>
      <ul className="legend" style={columnStyle}>
        {legendArray.map((item, index) => (
          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
              breakInside: "avoid",
            }}
            key={`${legendId}item[${index}]`}
          >
            <div style={{ background: item[1] }} />
            <span>{item[0]}</span>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

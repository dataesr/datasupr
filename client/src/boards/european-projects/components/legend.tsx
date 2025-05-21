import i18n from "../i18n-global.json";

export function GetLegend(legendArray: [string, string][], legendId: string, currentLang: string) {
  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <fieldset>
      <legend>{getI18nLabel("legend")}</legend>
      <div className="legend">
        <ul className="legend">
          {legendArray.map((item, index) => (
            <li
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
              key={`${legendId}item[${index}]`}
            >
              <div style={{ background: item[1] }} />
              <span>{item[0]}</span>
            </li>
          ))}
        </ul>
      </div>
    </fieldset>
  );
}

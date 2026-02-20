interface Props {
  allYearsData: any[];
  indicatorKey: string;
  indicatorLabel: string;
  availableYears: number[];
  formatter?: (v?: number) => string;
}

const defaultFormat = (v?: number) => (v != null ? String(v) : "—");

const truncate = (s: string, max = 40) =>
  s.length <= max ? s : s.slice(0, max - 1) + "…";

const cellClass = (status?: string) =>
  status === "alerte"
    ? "alerte"
    : status === "vigilance"
      ? "vigilance"
      : "normal";

export function SanteFinanciereTable({
  allYearsData,
  indicatorKey,
  indicatorLabel,
  availableYears,
  formatter = defaultFormat,
}: Props) {
  const years = availableYears.slice(-4).sort((a, b) => a - b);
  const statusKey = `${indicatorKey}_etat`;

  const relevant = allYearsData.filter(
    (d) => years.includes(d.exercice) && d[indicatorKey] != null
  );
  if (relevant.length === 0) return null;

  const byEtab = new Map<string, Map<number, any>>();
  relevant.forEach((item) => {
    const name =
      item.etablissement_actuel_lib || item.etablissement_lib || "Sans nom";
    if (!byEtab.has(name)) byEtab.set(name, new Map());
    byEtab.get(name)!.set(item.exercice, item);
  });

  const etabs = Array.from(byEtab.keys()).sort();

  return (
    <div className="sf-table fr-mb-3w">
      <table>
        <thead>
          <tr>
            <th>
              <strong>{indicatorLabel}</strong>
            </th>
            {years.map((y) => (
              <th key={y}>{y}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {etabs.map((etab) => (
            <tr key={etab}>
              <td title={etab}>{truncate(etab)}</td>
              {years.map((y) => {
                const d = byEtab.get(etab)?.get(y);
                return (
                  <td key={y} className={cellClass(d?.[statusKey])}>
                    {formatter(d?.[indicatorKey])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend fr-mt-2w">
        <div>
          <span className="vigilance" />
          <span>Vigilance</span>
        </div>
        <div>
          <span className="alerte" />
          <span>Alerte</span>
        </div>
      </div>
    </div>
  );
}

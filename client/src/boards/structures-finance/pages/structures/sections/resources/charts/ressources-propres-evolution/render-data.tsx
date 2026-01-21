import { RESSOURCES_CATEGORIES } from "./options";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";

interface RenderDataProps {
  data: any[];
}

export function RenderData({ data }: RenderDataProps) {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);
  const years = sortedData.map((d) => d.exercice);

  return (
    <div className="fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table
              id="ressources-propres-evolution-table"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Catégorie</th>
                  {years.map((year) => (
                    <th key={year} style={{ textAlign: "right" }}>
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RESSOURCES_CATEGORIES.map((cat) => (
                  <tr key={cat.key}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: cat.color,
                            borderRadius: "2px",
                          }}
                        />
                        <span>{cat.label}</span>
                      </div>
                    </td>
                    {sortedData.map((d) => (
                      <td
                        key={d.exercice}
                        style={{ textAlign: "right", fontWeight: 600 }}
                      >
                        {euro((d as any)[cat.key])} €
                      </td>
                    ))}
                  </tr>
                ))}
                <tr
                  style={{
                    backgroundColor: "var(--background-contrast-grey)",
                    fontWeight: 700,
                  }}
                >
                  <td>
                    <strong>Total</strong>
                  </td>
                  {sortedData.map((d) => {
                    let total = 0;
                    RESSOURCES_CATEGORIES.forEach((cat) => {
                      total += (d as any)[cat.key] || 0;
                    });
                    return (
                      <td key={d.exercice} style={{ textAlign: "right" }}>
                        <strong>{euro(total)} €</strong>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

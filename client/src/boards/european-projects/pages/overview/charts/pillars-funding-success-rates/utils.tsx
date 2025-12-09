import { useSearchParams } from "react-router-dom";

export function useGetParams() {
  const [searchParams] = useSearchParams();

  const params: string[] = [];

  // Récupérer le paramètre country_code s'il existe
  const countryCode = searchParams.get("country_code");
  if (countryCode) {
    params.push(`country_code=${countryCode}`);
  }

  // Récupérer le paramètre pillarId et l'ajouter comme pillars s'il existe
  const pillarId = searchParams.get("pillarId");
  if (pillarId) {
    params.push(`pillars=${pillarId}`);
  }

  return params.join("&");
}

/**
 * Génère un composant de tableau accessible avec les données de taux de succès par pilier
 * @param data - Les données de taux de succès par pilier
 * @param currentLang - La langue actuelle ('fr' ou 'en')
 * @returns Un composant JSX de tableau accessible ou un message si aucune donnée n'est disponible
 */
export function renderDataTable(data: { successRateByPillar: Array<{ pillar: string; successRate: number }> }, currentLang: string = "fr") {
  if (!data || !data.successRateByPillar || data.successRateByPillar.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        {currentLang === "fr" ? "Aucune donnée disponible pour le tableau." : "No data available for the table."}
      </div>
    );
  }

  // Trier par taux de succès (décroissant)
  const sortedPillars = [...data.successRateByPillar].sort((a, b) => b.successRate - a.successRate);

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2 
    }).format(value) + " %";
  };

  const labels = {
    pillar: currentLang === "fr" ? "Pilier" : "Pillar",
    successRate: currentLang === "fr" ? "Taux de succès" : "Success rate",
    caption: currentLang === "fr" 
      ? "Taux de succès par pilier (en pourcentage)" 
      : "Success rate by pillar (in percentage)",
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="fr-table-responsive">
        <table
          className="fr-table fr-table--bordered fr-table--sm"
          style={{ width: "100%" }}
        >
          <caption className="fr-sr-only">{labels.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{labels.pillar}</th>
              <th scope="col">{labels.successRate}</th>
            </tr>
          </thead>
          <tbody>
            {sortedPillars.map((pillar, index) => (
              <tr key={index}>
                <th scope="row">{pillar.pillar}</th>
                <td><strong>{formatPercentage(pillar.successRate)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

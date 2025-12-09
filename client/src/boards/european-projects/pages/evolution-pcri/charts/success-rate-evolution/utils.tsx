export function useGetParams() {
  const params: string[] = [];

  // Utiliser les totaux globaux (country_code=ALL) pour éviter de charger 1000+ lignes
  params.push("country_code=ALL");
  params.push("stages=evaluated|successful");

  return params.join("&");
}

export function getColorByFramework(framework: string): string {
  const rootStyles = getComputedStyle(document.documentElement);

  const frameworkColors: Record<string, string> = {
    FP6: rootStyles.getPropertyValue("--framework-fp6-color").trim() || "#28a745",
    FP7: rootStyles.getPropertyValue("--framework-fp7-color").trim() || "#5cb85c",
    "Horizon 2020": rootStyles.getPropertyValue("--framework-horizon2020-color").trim() || "#dc3545",
    "Horizon Europe": rootStyles.getPropertyValue("--framework-horizoneurope-color").trim() || "#ffc107",
  };

  return frameworkColors[framework] || "#6c757d";
}

export function readingKey(data, isLoading) {
  if (isLoading || !data) {
    return { fr: <></>, en: <></> };
  }

  interface YearFrameworkData {
    year: string;
    framework: string;
    evaluated: number;
    successful: number;
    successRate: number;
  }

  // Grouper les données par année et framework
  const dataByYearFramework: Record<string, YearFrameworkData> = data
    .filter((item) => item.country_code === "ALL") // Uniquement les totaux
    .reduce((acc, item) => {
      const key = `${item.call_year}_${item.framework}`;
      if (!acc[key]) {
        acc[key] = {
          year: item.call_year,
          framework: item.framework,
          evaluated: 0,
          successful: 0,
          successRate: 0,
        };
      }
      if (item.stage === "evaluated") {
        acc[key].evaluated = item.project_number || 0;
      } else if (item.stage === "successful") {
        acc[key].successful = item.project_number || 0;
      }
      return acc;
    }, {} as Record<string, YearFrameworkData>);

  // Calculer le taux de succès
  Object.values(dataByYearFramework).forEach((item) => {
    if (item.evaluated > 0) {
      item.successRate = (item.successful / item.evaluated) * 100;
    }
  });

  // Calculer la moyenne par framework
  const frameworkOrder = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];
  const avgByFramework: Record<string, number> = {};

  frameworkOrder.forEach((framework) => {
    const frameworkData = Object.values(dataByYearFramework).filter((d) => d.framework === framework);
    if (frameworkData.length > 0) {
      const avg = frameworkData.reduce((sum, d) => sum + d.successRate, 0) / frameworkData.length;
      avgByFramework[framework] = avg;
    }
  });

  // Trouver le framework avec le taux le plus élevé et le plus faible
  const validFrameworks = Object.entries(avgByFramework).filter(([, rate]) => rate > 0);
  const bestFramework = validFrameworks.reduce((max, current) => (current[1] > max[1] ? current : max), validFrameworks[0]);
  const worstFramework = validFrameworks.reduce((min, current) => (current[1] < min[1] ? current : min), validFrameworks[0]);

  if (!bestFramework || !worstFramework) {
    return { fr: <></>, en: <></> };
  }

  const fr = (
    <>
      Le taux de succès moyen varie significativement entre les frameworks : <strong>{bestFramework[0]}</strong> affiche le taux le plus élevé avec{" "}
      <strong>{bestFramework[1].toFixed(1)}%</strong>, tandis que <strong>{worstFramework[0]}</strong> présente le taux le plus faible avec{" "}
      <strong>{worstFramework[1].toFixed(1)}%</strong>. Cette évolution reflète l'intensification de la compétition au fil des programmes.
    </>
  );

  const en = (
    <>
      The average success rate varies significantly between frameworks: <strong>{bestFramework[0]}</strong> shows the highest rate at{" "}
      <strong>{bestFramework[1].toFixed(1)}%</strong>, while <strong>{worstFramework[0]}</strong> has the lowest rate at{" "}
      <strong>{worstFramework[1].toFixed(1)}%</strong>. This evolution reflects the intensification of competition across programs.
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}

/**
 * Génère un composant de tableau accessible avec les données de taux de succès par framework et par année
 * @param data - Les données brutes de l'évolution du taux de succès
 * @param currentLang - La langue actuelle ('fr' ou 'en')
 * @returns Un composant JSX de tableau accessible ou un message si aucune donnée n'est disponible
 */
export function renderDataTable(data: { call_year: string; framework: string; stage: string; project_number: number; country_code: string }[], currentLang: string = "fr") {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        {currentLang === "fr" ? "Aucune donnée disponible pour le tableau." : "No data available for the table."}
      </div>
    );
  }

  interface YearFrameworkData {
    year: string;
    framework: string;
    evaluated: number;
    successful: number;
    successRate: number;
  }

  // Grouper les données par année et framework
  const dataByYearFramework: Record<string, YearFrameworkData> = data
    .filter((item) => item.country_code === "ALL") // Uniquement les totaux
    .reduce((acc, item) => {
      const key = `${item.call_year}_${item.framework}`;
      if (!acc[key]) {
        acc[key] = {
          year: item.call_year,
          framework: item.framework,
          evaluated: 0,
          successful: 0,
          successRate: 0,
        };
      }
      if (item.stage === "evaluated") {
        acc[key].evaluated = item.project_number || 0;
      } else if (item.stage === "successful") {
        acc[key].successful = item.project_number || 0;
      }
      return acc;
    }, {} as Record<string, YearFrameworkData>);

  // Calculer le taux de succès
  Object.values(dataByYearFramework).forEach((item) => {
    if (item.evaluated > 0) {
      item.successRate = (item.successful / item.evaluated) * 100;
    }
  });

  // Trier par année
  const sortedData = Object.values(dataByYearFramework)
    .filter((item) => item.framework !== "FP6") // Exclure FP6 (pas de données evaluated)
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Extraire les années uniques
  const years = [...new Set(sortedData.map((d) => d.year))].sort();

  // Liste des frameworks (sans FP6)
  const frameworkOrder = ["FP7", "Horizon 2020", "Horizon Europe"];
  
  // Obtenir uniquement les frameworks qui ont des données
  const availableFrameworks = frameworkOrder.filter((framework) =>
    sortedData.some((item) => item.framework === framework && item.successRate > 0)
  );

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 1,
      minimumFractionDigits: 1 
    }).format(value) + " %";
  };

  const labels = {
    year: currentLang === "fr" ? "Année" : "Year",
    evaluated: currentLang === "fr" ? "Évalués" : "Evaluated",
    successful: currentLang === "fr" ? "Retenus" : "Successful",
    successRate: currentLang === "fr" ? "Taux de succès" : "Success rate",
    caption: currentLang === "fr" 
      ? "Évolution du taux de succès par programme-cadre européen" 
      : "Evolution of success rate by European framework programme",
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
              <th scope="col" rowSpan={2}>{labels.year}</th>
              {availableFrameworks.map((framework) => (
                <th scope="col" colSpan={3} key={framework} style={{ textAlign: "center" }}>
                  {framework}
                </th>
              ))}
            </tr>
            <tr>
              {availableFrameworks.map((framework) => (
                <>
                  <th scope="col" key={`${framework}-evaluated`}>{labels.evaluated}</th>
                  <th scope="col" key={`${framework}-successful`}>{labels.successful}</th>
                  <th scope="col" key={`${framework}-rate`}>{labels.successRate}</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((year, index) => (
              <tr key={index}>
                <th scope="row">{year}</th>
                {availableFrameworks.map((framework) => {
                  const item = sortedData.find((d) => d.year === year && d.framework === framework);
                  return (
                    <>
                      <td key={`${framework}-evaluated`}>
                        {item && item.evaluated > 0 ? formatNumber(item.evaluated) : "—"}
                      </td>
                      <td key={`${framework}-successful`}>
                        {item && item.successful > 0 ? formatNumber(item.successful) : "—"}
                      </td>
                      <td key={`${framework}-rate`}>
                        {item && item.successRate > 0 ? (
                          <strong>{formatPercentage(item.successRate)}</strong>
                        ) : "—"}
                      </td>
                    </>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function useGetParams() {
  const params: string[] = [];

  // Utiliser les totaux globaux (country_code=ALL) pour éviter de charger 1000+ lignes
  params.push("country_code=ALL");
  params.push("stage=successful");

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

  interface YearData {
    year: string;
    total: number;
    frameworks: Record<string, number>;
  }

  // Grouper les données par année
  const dataByYear: Record<string, YearData> = data.reduce((acc, item) => {
    if (!acc[item.call_year]) {
      acc[item.call_year] = {
        year: item.call_year,
        total: 0,
        frameworks: {},
      };
    }
    acc[item.call_year].total += item.funding || 0;
    if (!acc[item.call_year].frameworks[item.framework]) {
      acc[item.call_year].frameworks[item.framework] = 0;
    }
    acc[item.call_year].frameworks[item.framework] += item.funding || 0;
    return acc;
  }, {} as Record<string, YearData>);

  const years = Object.values(dataByYear).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  if (years.length === 0) {
    return { fr: <></>, en: <></> };
  }

  // Comparer les frameworks complets : FP7 vs Horizon 2020
  const fp7Years = years.filter((y) => Object.keys(y.frameworks).includes("FP7"));
  const h2020Years = years.filter((y) => Object.keys(y.frameworks).includes("Horizon 2020"));

  if (fp7Years.length === 0 || h2020Years.length === 0) {
    return { fr: <></>, en: <></> };
  }

  // Calculer les totaux par framework
  const fp7Total = fp7Years.reduce((sum, year) => sum + (year.frameworks["FP7"] || 0), 0);
  const h2020Total = h2020Years.reduce((sum, year) => sum + (year.frameworks["Horizon 2020"] || 0), 0);
  const growth = (((h2020Total - fp7Total) / fp7Total) * 100).toFixed(1);

  const formatToMillions = (value: number) => {
    const millions = value / 1000000;
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(millions) + " M€";
  };

  const formatToMillionsEN = (value: number) => {
    const millions = value / 1000000;
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(millions) + " M€";
  };

  const fr = (
    <>
      Comparaison des frameworks complets : <strong>FP7</strong> (2007-2013) a généré un financement total de{" "}
      <strong>{formatToMillions(fp7Total)}</strong>, tandis que <strong>Horizon 2020</strong> (2014-2020) a atteint{" "}
      <strong>{formatToMillions(h2020Total)}</strong>, soit une croissance de <strong>{growth}%</strong>. Les données pour Horizon Europe sont encore
      partielles.
    </>
  );

  const en = (
    <>
      Comparison of completed frameworks: <strong>FP7</strong> (2007-2013) generated total funding of <strong>{formatToMillionsEN(fp7Total)}</strong>,
      while <strong>Horizon 2020</strong> (2014-2020) reached <strong>{formatToMillionsEN(h2020Total)}</strong>, representing a growth of{" "}
      <strong>{growth}%</strong>. Data for Horizon Europe is still partial.
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}

/**
 * Génère un composant de tableau accessible avec les données de financement par framework et par année
 * @param data - Les données brutes de l'évolution du financement
 * @param currentLang - La langue actuelle ('fr' ou 'en')
 * @returns Un composant JSX de tableau accessible ou un message si aucune donnée n'est disponible
 */
export function renderDataTable(data: { call_year: string; framework: string; funding: number }[], currentLang: string = "fr") {
  const { getI18nLabel } = require("../../../../../../utils");
  const i18n = require("../../../../i18n-global.json");
  
  if (!data || data.length === 0) {
    return <div className="fr-text--center fr-py-3w">{getI18nLabel(i18n, "no-data-table")}</div>;
  }

  interface YearFrameworkData {
    year: string;
    frameworks: Record<string, number>;
    total: number;
  }

  // Grouper les données par année et framework
  const dataByYear: Record<string, YearFrameworkData> = data.reduce((acc, item) => {
    if (!acc[item.call_year]) {
      acc[item.call_year] = {
        year: item.call_year,
        frameworks: {},
        total: 0,
      };
    }
    if (!acc[item.call_year].frameworks[item.framework]) {
      acc[item.call_year].frameworks[item.framework] = 0;
    }
    acc[item.call_year].frameworks[item.framework] += item.funding || 0;
    acc[item.call_year].total += item.funding || 0;
    return acc;
  }, {} as Record<string, YearFrameworkData>);

  // Trier par année
  const sortedYears = Object.values(dataByYear).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Liste des frameworks dans l'ordre chronologique
  const frameworkOrder = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];
  
  // Obtenir uniquement les frameworks qui ont des données
  const availableFrameworks = frameworkOrder.filter((framework) =>
    sortedYears.some((yearData) => yearData.frameworks[framework] && yearData.frameworks[framework] > 0)
  );

  const formatToMillions = (value: number) => {
    const millions = value / 1000000;
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2 
    }).format(millions);
  };

  const labels = {
    year: getI18nLabel(i18n, "year"),
    total: getI18nLabel(i18n, "total"),
    unit: "M€",
    caption: getI18nLabel(i18n, "caption-pillar-evolution"),
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
              <th scope="col">{labels.year}</th>
              {availableFrameworks.map((framework) => (
                <th scope="col" key={framework}>
                  {framework}
                </th>
              ))}
              <th scope="col">{labels.total}</th>
            </tr>
          </thead>
          <tbody>
            {sortedYears.map((yearData, index) => (
              <tr key={index}>
                <th scope="row">{yearData.year}</th>
                {availableFrameworks.map((framework) => (
                  <td key={framework}>
                    {yearData.frameworks[framework] 
                      ? `${formatToMillions(yearData.frameworks[framework])} ${labels.unit}` 
                      : "—"}
                  </td>
                ))}
                <td>
                  <strong>{formatToMillions(yearData.total)} {labels.unit}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

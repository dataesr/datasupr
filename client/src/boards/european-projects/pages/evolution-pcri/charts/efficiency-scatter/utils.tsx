export function useGetParams() {
  const params: string[] = [];

  // Récupérer les projets evaluated ET successful pour calculer le taux de succès
  params.push("stages=evaluated|successful");

  return params.join("&");
}

export function readingKey(data, isLoading) {
  if (isLoading || !data) {
    return { fr: <></>, en: <></> };
  }

  interface CountryData {
    country: string;
    evaluated: number;
    successful: number;
    successfulFunding: number;
    successRate: number;
  }

  // Grouper les données par pays
  const dataByCountry: Record<string, CountryData> = data
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE") // Exclure "Tous pays" et "Etats membres & associés"
    .reduce((acc, item) => {
      if (!acc[item.country_code]) {
        acc[item.country_code] = {
          country: item.country_name_fr,
          evaluated: 0,
          successful: 0,
          successfulFunding: 0,
          successRate: 0,
        };
      }
      if (item.stage === "evaluated") {
        acc[item.country_code].evaluated += item.project_number || 0;
      } else if (item.stage === "successful") {
        acc[item.country_code].successful += item.project_number || 0;
        acc[item.country_code].successfulFunding += item.funding || 0;
      }
      return acc;
    }, {} as Record<string, CountryData>);

  // Calculer le taux de succès
  Object.values(dataByCountry).forEach((country) => {
    if (country.evaluated > 0) {
      country.successRate = (country.successful / country.evaluated) * 100;
    }
  });

  // Trouver le pays avec le meilleur équilibre (taux de succès élevé ET part importante)
  const validCountries = Object.values(dataByCountry).filter((c) => c.successRate > 0 && c.successfulFunding > 0);

  // Score composite : taux de succès * financement
  const bestBalanced = validCountries.map((c) => ({ ...c, score: c.successRate * c.successfulFunding })).sort((a, b) => b.score - a.score)[0];

  if (!bestBalanced) {
    return { fr: <></>, en: <></> };
  }

  const formatToMillions = (value: number) => {
    const millions = value / 1000000;
    return `${millions.toFixed(2)} M€`;
  };

  const fr = (
    <>
      <strong>{bestBalanced.country}</strong> présente le meilleur équilibre entre performance et volume, avec un taux de succès de{" "}
      <strong>{bestBalanced.successRate.toFixed(1)}%</strong> et un financement total de{" "}
      <strong>{formatToMillions(bestBalanced.successfulFunding)}</strong> sur <strong>{bestBalanced.successful}</strong> projets réussis. Ce graphique
      permet d'identifier les pays "performants" (haut taux + forte part) vs "actifs mais moins efficaces".
    </>
  );

  const en = (
    <>
      <strong>{bestBalanced.country}</strong> shows the best balance between performance and volume, with a success rate of{" "}
      <strong>{bestBalanced.successRate.toFixed(1)}%</strong> and total funding of <strong>{formatToMillions(bestBalanced.successfulFunding)}</strong>{" "}
      across <strong>{bestBalanced.successful}</strong> successful projects. This chart identifies "high-performing" countries (high rate + large
      share) vs "active but less efficient" ones.
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}

/**
 * Génère un composant de tableau accessible avec les données d'efficacité des pays (taux de succès et part de financement)
 * @param data - Les données brutes de l'évolution par pays
 * @param currentLang - La langue actuelle ('fr' ou 'en')
 * @returns Un composant JSX de tableau accessible ou un message si aucune donnée n'est disponible
 */
export function renderDataTable(data: { country_code: string; country_name_fr: string; stage: string; project_number: number; funding: number }[], currentLang: string = "fr") {
  const { getI18nLabel } = require("../../../../../../utils");
  const i18n = require("../../../../i18n-global.json");
  
  if (!data || data.length === 0) {
    return <div className="fr-text--center fr-py-3w">{getI18nLabel(i18n, "no-data-table")}</div>;
  }

  interface CountryData {
    country: string;
    countryCode: string;
    evaluated: number;
    successful: number;
    successfulFunding: number;
    successfulShare: number;
    successRate: number;
  }

  // Calculer le total global du financement (country_code = ALL)
  const totalFunding = data
    .filter((item) => item.country_code === "ALL" && item.stage === "successful")
    .reduce((sum, item) => sum + (item.funding || 0), 0);

  // Grouper les données par pays
  const dataByCountry: Record<string, CountryData> = data
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE") // Exclure "Tous pays" et "Etats membres & associés"
    .reduce((acc, item) => {
      if (!acc[item.country_code]) {
        acc[item.country_code] = {
          country: item.country_name_fr,
          countryCode: item.country_code,
          evaluated: 0,
          successful: 0,
          successfulFunding: 0,
          successfulShare: 0,
          successRate: 0,
        };
      }
      if (item.stage === "evaluated") {
        acc[item.country_code].evaluated += item.project_number || 0;
      } else if (item.stage === "successful") {
        acc[item.country_code].successful += item.project_number || 0;
        acc[item.country_code].successfulFunding += item.funding || 0;
      }
      return acc;
    }, {} as Record<string, CountryData>);

  // Calculer le taux de succès et les parts
  Object.values(dataByCountry).forEach((country) => {
    if (country.evaluated > 0) {
      country.successRate = (country.successful / country.evaluated) * 100;
    }
    if (totalFunding > 0) {
      country.successfulShare = (country.successfulFunding / totalFunding) * 100;
    }
  });

  // Filtrer les pays valides et prendre les top 15 par financement
  const validCountries = Object.values(dataByCountry)
    .filter((c) => c.successRate > 0 && c.successfulFunding > 0)
    .sort((a, b) => b.successfulFunding - a.successfulFunding)
    .slice(0, 15);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatToMillions = (value: number) => {
    const millions = value / 1000000;
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 2
    }).format(millions);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 1,
      minimumFractionDigits: 1 
    }).format(value) + " %";
  };

  const labels = {
    country: getI18nLabel(i18n, "country"),
    evaluated: getI18nLabel(i18n, "projects-evaluated"),
    successful: getI18nLabel(i18n, "projects-successful"),
    successRate: getI18nLabel(i18n, "success-rate"),
    funding: getI18nLabel(i18n, "funding"),
    fundingShare: getI18nLabel(i18n, "funding-share"),
    unit: "M€",
    caption: getI18nLabel(i18n, "caption-funding-ranking-rates"),
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
              <th scope="col">{labels.country}</th>
              <th scope="col">{labels.evaluated}</th>
              <th scope="col">{labels.successful}</th>
              <th scope="col">{labels.successRate}</th>
              <th scope="col">{labels.funding}</th>
              <th scope="col">{labels.fundingShare}</th>
            </tr>
          </thead>
          <tbody>
            {validCountries.map((country, index) => (
              <tr key={index}>
                <th scope="row">{country.country}</th>
                <td>{formatNumber(country.evaluated)}</td>
                <td>{formatNumber(country.successful)}</td>
                <td><strong>{formatPercentage(country.successRate)}</strong></td>
                <td>{formatToMillions(country.successfulFunding)} {labels.unit}</td>
                <td><strong>{formatPercentage(country.successfulShare)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

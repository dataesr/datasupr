export function useGetParams() {
  const params: string[] = [];

  // Filtre par défaut : uniquement les projets successful
  params.push("stages=successful");

  return params.join("&");
}

export function readingKey(data, isLoading) {
  if (isLoading || !data) {
    return { fr: <></>, en: <></> };
  }

  interface CountryFrameworkData {
    country: string;
    framework: string;
    funding: number;
  }

  // Grouper les données par pays et framework
  const dataByCountryFramework: Record<string, CountryFrameworkData> = data
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE") // Exclure "Tous pays" et "Etats membres & associés"
    .reduce((acc, item) => {
      const key = `${item.country_code}_${item.framework}`;
      if (!acc[key]) {
        acc[key] = {
          country: item.country_name_fr,
          framework: item.framework,
          funding: 0,
        };
      }
      acc[key].funding += item.funding || 0;
      return acc;
    }, {} as Record<string, CountryFrameworkData>);

  const frameworkOrder = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];

  // Calculer le classement pour chaque framework et ne garder que les top 15
  const rankings: Record<string, Array<{ country: string; funding: number; rank: number }>> = {};

  frameworkOrder.forEach((framework) => {
    const frameworkData = Object.values(dataByCountryFramework)
      .filter((item) => item.framework === framework)
      .sort((a, b) => b.funding - a.funding)
      .slice(0, 15) // Top 15
      .map((item, index) => ({
        country: item.country,
        funding: item.funding,
        rank: index + 1,
      }));
    rankings[framework] = frameworkData;
  });

  // Identifier tous les pays qui apparaissent dans au moins un top 15
  const allTopCountries = new Set<string>();
  Object.values(rankings).forEach((rankList) => {
    rankList.forEach((item) => allTopCountries.add(item.country));
  });

  // Identifier le pays avec la plus forte progression (qui a le plus gagné de places)
  // uniquement parmi les pays du top 15
  const countryRankChanges: Record<string, { first: number; last: number; change: number }> = {};

  const firstFramework = frameworkOrder[0];
  const lastFramework = frameworkOrder[frameworkOrder.length - 1];

  rankings[firstFramework]?.forEach((item) => {
    // Ne considérer que les pays qui sont dans le top 15 d'au moins un framework
    if (allTopCountries.has(item.country)) {
      const lastRank = rankings[lastFramework]?.find((r) => r.country === item.country);
      if (lastRank) {
        countryRankChanges[item.country] = {
          first: item.rank,
          last: lastRank.rank,
          change: item.rank - lastRank.rank, // Positif = progression
        };
      }
    }
  });

  const topProgressCountry = Object.entries(countryRankChanges).sort((a, b) => b[1].change - a[1].change)[0];

  if (!topProgressCountry) {
    return { fr: <></>, en: <></> };
  }

  const [countryName, rankData] = topProgressCountry;

  const fr = (
    <>
      Parmi les 15 premiers pays, <strong>{countryName}</strong> affiche la plus forte progression entre {firstFramework} et {lastFramework}, passant
      de la <strong>{rankData.first}ème</strong> à la <strong>{rankData.last}ème</strong> place, soit un gain de <strong>{rankData.change}</strong>{" "}
      position
      {rankData.change > 1 ? "s" : ""}. Ce graphique révèle les dynamiques de compétition entre pays au fil du temps.
    </>
  );

  const en = (
    <>
      Among the top 15 countries, <strong>{countryName}</strong> shows the strongest progression between {firstFramework} and {lastFramework}, moving
      from <strong>{rankData.first}th</strong> to <strong>{rankData.last}th</strong> place, a gain of <strong>{rankData.change}</strong> position
      {rankData.change > 1 ? "s" : ""}. This chart reveals the competitive dynamics between countries over time.
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}

/**
 * Génère un composant de tableau accessible avec le classement des pays par framework
 * @param data - Les données brutes de l'évolution par pays
 * @param currentLang - La langue actuelle ('fr' ou 'en')
 * @returns Un composant JSX de tableau accessible ou un message si aucune donnée n'est disponible
 */
export function renderDataTable(data: { country_code: string; country_name_fr: string; framework: string; funding: number }[], currentLang: string = "fr") {
  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        {currentLang === "fr" ? "Aucune donnée disponible pour le tableau." : "No data available for the table."}
      </div>
    );
  }

  interface CountryFrameworkData {
    country: string;
    countryCode: string;
    framework: string;
    funding: number;
  }

  // Grouper les données par pays et framework
  const dataByCountryFramework: Record<string, CountryFrameworkData> = data
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE") // Exclure "Tous pays" et "Etats membres & associés"
    .reduce((acc, item) => {
      const key = `${item.country_code}_${item.framework}`;
      if (!acc[key]) {
        acc[key] = {
          country: item.country_name_fr,
          countryCode: item.country_code,
          framework: item.framework,
          funding: 0,
        };
      }
      acc[key].funding += item.funding || 0;
      return acc;
    }, {} as Record<string, CountryFrameworkData>);

  const frameworkOrder = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];

  // Calculer le classement pour chaque framework et ne garder que les top 15
  const rankings: Record<string, Array<{ country: string; countryCode: string; funding: number; rank: number }>> = {};

  frameworkOrder.forEach((framework) => {
    const frameworkData = Object.values(dataByCountryFramework)
      .filter((item) => item.framework === framework)
      .sort((a, b) => b.funding - a.funding)
      .slice(0, 15) // Top 15
      .map((item, index) => ({
        country: item.country,
        countryCode: item.countryCode,
        funding: item.funding,
        rank: index + 1,
      }));
    rankings[framework] = frameworkData;
  });

  // Identifier tous les pays qui apparaissent dans au moins un top 15
  const allTopCountries = new Set<string>();
  Object.values(rankings).forEach((rankList) => {
    rankList.forEach((item) => allTopCountries.add(item.countryCode));
  });

  // Créer une liste unique de tous les pays du top 15 (triés par classement dans Horizon Europe, ou le framework le plus récent)
  const lastFramework = frameworkOrder[frameworkOrder.length - 1];
  const sortedCountries = Array.from(allTopCountries).sort((a, b) => {
    const rankA = rankings[lastFramework]?.find((r) => r.countryCode === a)?.rank || 999;
    const rankB = rankings[lastFramework]?.find((r) => r.countryCode === b)?.rank || 999;
    return rankA - rankB;
  });

  const formatToMillions = (value: number) => {
    const millions = value / 1000000;
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 0
    }).format(millions);
  };

  const labels = {
    rank: currentLang === "fr" ? "Rang" : "Rank",
    country: currentLang === "fr" ? "Pays" : "Country",
    funding: currentLang === "fr" ? "Financement" : "Funding",
    unit: "M€",
    caption: currentLang === "fr" 
      ? "Classement des pays par financement européen et par programme-cadre (Top 15)" 
      : "Country ranking by European funding and framework programme (Top 15)",
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
              <th scope="col" rowSpan={2}>{labels.country}</th>
              {frameworkOrder.map((framework) => (
                <th scope="col" colSpan={2} key={framework} style={{ textAlign: "center" }}>
                  {framework}
                </th>
              ))}
            </tr>
            <tr>
              {frameworkOrder.map((framework) => (
                <>
                  <th scope="col" key={`${framework}-rank`}>{labels.rank}</th>
                  <th scope="col" key={`${framework}-funding`}>{labels.funding}</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCountries.map((countryCode) => {
              const countryName = data.find((d) => d.country_code === countryCode)?.country_name_fr || countryCode;
              return (
                <tr key={countryCode}>
                  <th scope="row">{countryName}</th>
                  {frameworkOrder.map((framework) => {
                    const rankData = rankings[framework]?.find((r) => r.countryCode === countryCode);
                    return (
                      <>
                        <td key={`${framework}-rank`} style={{ textAlign: "center" }}>
                          {rankData ? rankData.rank : "—"}
                        </td>
                        <td key={`${framework}-funding`}>
                          {rankData ? `${formatToMillions(rankData.funding)} ${labels.unit}` : "—"}
                        </td>
                      </>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

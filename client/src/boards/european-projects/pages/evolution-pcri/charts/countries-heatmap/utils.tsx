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
    share: number;
    funding: number;
  }

  // Calculer les totaux par framework (country_code = ALL)
  const totalsByFramework: Record<string, number> = data
    .filter((item) => item.country_code === "ALL")
    .reduce((acc, item) => {
      if (!acc[item.framework]) {
        acc[item.framework] = 0;
      }
      acc[item.framework] += item.funding || 0;
      return acc;
    }, {} as Record<string, number>);

  // Grouper les données par pays et framework
  const dataByCountryFramework: Record<string, CountryFrameworkData> = data
    .filter((item) => item.country_code !== "ALL" && item.country_code !== "UE") // Exclure "Tous pays" et "Etats membres & associés"
    .reduce((acc, item) => {
      const key = `${item.country_code}_${item.framework}`;
      if (!acc[key]) {
        acc[key] = {
          country: item.country_name_fr,
          framework: item.framework,
          share: 0,
          funding: 0,
        };
      }
      acc[key].funding += item.funding || 0;
      return acc;
    }, {} as Record<string, CountryFrameworkData>);

  // Recalculer les parts correctement
  Object.keys(dataByCountryFramework).forEach((key) => {
    const item = dataByCountryFramework[key];
    const total = totalsByFramework[item.framework] || 1;
    item.share = (item.funding / total) * 100;
  });

  const allData = Object.values(dataByCountryFramework);

  // Calculer la part totale par pays (somme de tous les frameworks) pour identifier le top 15
  const countryTotals: Record<string, { name: string; total: number }> = {};
  allData.forEach((item) => {
    if (!countryTotals[item.country]) {
      countryTotals[item.country] = { name: item.country, total: 0 };
    }
    countryTotals[item.country].total += item.funding;
  });

  // Identifier les top 15 pays
  const top15Countries = Object.values(countryTotals)
    .sort((a, b) => b.total - a.total)
    .slice(0, 15)
    .map((c) => c.name);

  // Identifier le pays avec la plus forte croissance de part entre FP7 et Horizon 2020 (frameworks complets)
  // uniquement parmi les pays du top 15
  const countryGrowth: Record<string, { fp7: number; h2020: number; growth: number }> = {};

  allData
    .filter((item) => top15Countries.includes(item.country)) // Filtrer uniquement les top 15
    .forEach((item) => {
      if (!countryGrowth[item.country]) {
        countryGrowth[item.country] = { fp7: 0, h2020: 0, growth: 0 };
      }
      if (item.framework === "FP7") {
        countryGrowth[item.country].fp7 = item.share;
      } else if (item.framework === "Horizon 2020") {
        countryGrowth[item.country].h2020 = item.share;
      }
    });

  // Calculer la croissance
  Object.keys(countryGrowth).forEach((country) => {
    const data = countryGrowth[country];
    if (data.fp7 > 0) {
      data.growth = ((data.h2020 - data.fp7) / data.fp7) * 100;
    }
  });

  // Trouver le pays avec la plus forte croissance (parmi le top 15)
  const topGrowthCountry = Object.entries(countryGrowth)
    .filter(([, data]) => data.fp7 > 0 && data.h2020 > 0)
    .sort((a, b) => b[1].growth - a[1].growth)[0];

  const formatToPercent = (value: number) => `${value.toFixed(2)}%`;

  if (!topGrowthCountry) {
    return { fr: <></>, en: <></> };
  }

  const [countryName, growthData] = topGrowthCountry;

  const fr = (
    <>
      Parmi les 15 premiers pays, <strong>{countryName}</strong> affiche la plus forte progression de part de financement entre FP7 et Horizon 2020
      (frameworks complets), passant de <strong>{formatToPercent(growthData.fp7)}</strong> à <strong>{formatToPercent(growthData.h2020)}</strong>,
      soit une croissance de <strong>{growthData.growth.toFixed(1)}%</strong>. Cette heatmap révèle les tendances d'évolution de chaque pays à travers
      les frameworks successifs.
    </>
  );

  const en = (
    <>
      Among the top 15 countries, <strong>{countryName}</strong> shows the strongest growth in funding share between FP7 and Horizon 2020 (completed
      frameworks), increasing from <strong>{formatToPercent(growthData.fp7)}</strong> to <strong>{formatToPercent(growthData.h2020)}</strong>, a
      growth of <strong>{growthData.growth.toFixed(1)}%</strong>. This heatmap reveals the evolution trends of each country across successive
      frameworks.
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}

/**
 * Génère un composant de tableau accessible avec les données de part de financement par pays et par framework
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
    share: number;
    funding: number;
  }

  // Calculer les totaux par framework (country_code = ALL)
  const totalsByFramework: Record<string, number> = data
    .filter((item) => item.country_code === "ALL")
    .reduce((acc, item) => {
      if (!acc[item.framework]) {
        acc[item.framework] = 0;
      }
      acc[item.framework] += item.funding || 0;
      return acc;
    }, {} as Record<string, number>);

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
          share: 0,
          funding: 0,
        };
      }
      acc[key].funding += item.funding || 0;
      return acc;
    }, {} as Record<string, CountryFrameworkData>);

  // Recalculer les parts correctement
  Object.keys(dataByCountryFramework).forEach((key) => {
    const item = dataByCountryFramework[key];
    const total = totalsByFramework[item.framework] || 1;
    item.share = (item.funding / total) * 100;
  });

  const allData = Object.values(dataByCountryFramework);

  // Calculer la part totale par pays (somme de tous les frameworks)
  const countryTotals: Record<string, number> = {};
  allData.forEach((item) => {
    if (!countryTotals[item.countryCode]) {
      countryTotals[item.countryCode] = 0;
    }
    countryTotals[item.countryCode] += item.funding;
  });

  // Trier les pays par financement total et prendre les top 15
  const top15Countries = Object.entries(countryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([code]) => code);

  // Filtrer les données pour ne garder que les top 15
  const filteredData = allData.filter((item) => top15Countries.includes(item.countryCode));

  // Créer la liste des frameworks dans l'ordre chronologique
  const frameworkOrder = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];

  // Obtenir la liste des pays triés par financement total
  const countries = [...new Set(filteredData.map((item) => item.country))].sort((a, b) => {
    const codeA = filteredData.find((d) => d.country === a)?.countryCode || "";
    const codeB = filteredData.find((d) => d.country === b)?.countryCode || "";
    const indexA = top15Countries.indexOf(codeA);
    const indexB = top15Countries.indexOf(codeB);
    return indexA - indexB;
  });

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2 
    }).format(value) + " %";
  };

  const labels = {
    country: currentLang === "fr" ? "Pays" : "Country",
    caption: currentLang === "fr" 
      ? "Part de financement par pays et par programme-cadre européen (Top 15, en pourcentage)" 
      : "Funding share by country and European framework programme (Top 15, in percentage)",
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
              {frameworkOrder.map((framework) => (
                <th scope="col" key={framework}>
                  {framework}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {countries.map((country, index) => (
              <tr key={index}>
                <th scope="row">{country}</th>
                {frameworkOrder.map((framework) => {
                  const item = filteredData.find((d) => d.country === country && d.framework === framework);
                  return (
                    <td key={framework}>
                      {item && item.share > 0 ? formatPercentage(item.share) : "—"}
                    </td>
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

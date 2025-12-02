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

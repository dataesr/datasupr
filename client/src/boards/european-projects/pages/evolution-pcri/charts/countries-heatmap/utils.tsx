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

  // Identifier le pays avec la plus forte croissance de part entre FP6 et HE
  const countryGrowth: Record<string, { fp6: number; he: number; growth: number }> = {};

  allData.forEach((item) => {
    if (!countryGrowth[item.country]) {
      countryGrowth[item.country] = { fp6: 0, he: 0, growth: 0 };
    }
    if (item.framework === "FP6") {
      countryGrowth[item.country].fp6 = item.share;
    } else if (item.framework === "Horizon Europe") {
      countryGrowth[item.country].he = item.share;
    }
  });

  // Calculer la croissance
  Object.keys(countryGrowth).forEach((country) => {
    const data = countryGrowth[country];
    if (data.fp6 > 0) {
      data.growth = ((data.he - data.fp6) / data.fp6) * 100;
    }
  });

  // Trouver le pays avec la plus forte croissance
  const topGrowthCountry = Object.entries(countryGrowth)
    .filter(([, data]) => data.fp6 > 0 && data.he > 0)
    .sort((a, b) => b[1].growth - a[1].growth)[0];

  const formatToPercent = (value: number) => `${value.toFixed(2)}%`;

  if (!topGrowthCountry) {
    return { fr: <></>, en: <></> };
  }

  const [countryName, growthData] = topGrowthCountry;

  const fr = (
    <>
      <strong>{countryName}</strong> affiche la plus forte progression de part de financement entre FP6 et Horizon Europe, passant de{" "}
      <strong>{formatToPercent(growthData.fp6)}</strong> à <strong>{formatToPercent(growthData.he)}</strong>, soit une croissance de{" "}
      <strong>{growthData.growth.toFixed(1)}%</strong>. Cette heatmap révèle les tendances d'évolution de chaque pays à travers les frameworks
      successifs.
    </>
  );

  const en = (
    <>
      <strong>{countryName}</strong> shows the strongest growth in funding share between FP6 and Horizon Europe, increasing from{" "}
      <strong>{formatToPercent(growthData.fp6)}</strong> to <strong>{formatToPercent(growthData.he)}</strong>, a growth of{" "}
      <strong>{growthData.growth.toFixed(1)}%</strong>. This heatmap reveals the evolution trends of each country across successive frameworks.
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}

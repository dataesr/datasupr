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

  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const totalGrowth = (((lastYear.total - firstYear.total) / firstYear.total) * 100).toFixed(1);

  // Identifier le framework dominant dans la dernière année
  const lastYearFrameworks = Object.entries(lastYear.frameworks);
  const dominantFramework = lastYearFrameworks.reduce((max, current) => (current[1] > max[1] ? current : max), lastYearFrameworks[0]);

  const formatToMillions = (value: number) => {
    const millions = value / 1000000;
    return `${millions.toFixed(2)} M€`;
  };

  const fr = (
    <>
      Entre <strong>{firstYear.year}</strong> et <strong>{lastYear.year}</strong>, le financement global des projets européens est passé de{" "}
      <strong>{formatToMillions(firstYear.total)}</strong> à <strong>{formatToMillions(lastYear.total)}</strong>, soit une croissance de{" "}
      <strong>{totalGrowth}%</strong>. En {lastYear.year}, <strong>{dominantFramework[0]}</strong> représente la plus grande part avec{" "}
      <strong>{formatToMillions(dominantFramework[1])}</strong>.
    </>
  );

  const en = (
    <>
      Between <strong>{firstYear.year}</strong> and <strong>{lastYear.year}</strong>, the overall funding for European projects increased from{" "}
      <strong>{formatToMillions(firstYear.total)}</strong> to <strong>{formatToMillions(lastYear.total)}</strong>, representing a growth of{" "}
      <strong>{totalGrowth}%</strong>. In {lastYear.year}, <strong>{dominantFramework[0]}</strong> accounts for the largest share with{" "}
      <strong>{formatToMillions(dominantFramework[1])}</strong>.
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}

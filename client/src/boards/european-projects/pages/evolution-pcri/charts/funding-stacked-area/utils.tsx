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

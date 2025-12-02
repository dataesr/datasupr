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

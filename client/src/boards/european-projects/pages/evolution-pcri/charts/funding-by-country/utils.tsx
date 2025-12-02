import { useSearchParams } from "react-router-dom";

export function useGetParams() {
  const [searchParams] = useSearchParams();

  const params: string[] = [];

  // Récupérer le paramètre country_code s'il existe
  const countryCode = searchParams.get("country_code");
  if (countryCode) {
    params.push(`country_code=${countryCode}`);
  }

  // Filtre par défaut : uniquement les projets successful
  params.push("stages=successful");

  return params.join("&");
}

// Fonction pour obtenir la couleur selon le framework
export function getColorByFramework(framework: string): string {
  const rootStyles = getComputedStyle(document.documentElement);

  const frameworkColors: Record<string, string> = {
    FP6: rootStyles.getPropertyValue("--framework-fp6-color").trim() || "#28a745",
    FP7: rootStyles.getPropertyValue("--framework-fp7-color").trim() || "#5cb85c",
    "Horizon 2020": rootStyles.getPropertyValue("--framework-horizon2020-color").trim() || "#dc3545",
    "Horizon Europe": rootStyles.getPropertyValue("--framework-horizoneurope-color").trim() || "#ffc107",
  };

  return frameworkColors[framework] || "#6c757d"; // Gris par défaut
}

export function readingKey(data, isLoading) {
  if (isLoading || !data) {
    return { fr: <></>, en: <></> };
  }

  interface FrameworkData {
    framework: string;
    totalFunding: number;
    totalProjects: number;
    years: string[];
    avgFundingPerYear: number;
  }

  // Grouper les données par framework
  const dataByFramework: Record<string, FrameworkData> = data.reduce((acc, item) => {
    if (!acc[item.framework]) {
      acc[item.framework] = {
        framework: item.framework,
        totalFunding: 0,
        totalProjects: 0,
        years: [],
        avgFundingPerYear: 0,
      };
    }
    acc[item.framework].totalFunding += item.funding || 0;
    acc[item.framework].totalProjects += item.project_number || 0;
    if (!acc[item.framework].years.includes(item.call_year)) {
      acc[item.framework].years.push(item.call_year);
    }
    return acc;
  }, {} as Record<string, FrameworkData>);

  // Calculer la moyenne annuelle pour chaque framework
  Object.values(dataByFramework).forEach((framework) => {
    const nbYears = framework.years.length;
    framework.avgFundingPerYear = nbYears > 0 ? framework.totalFunding / nbYears : 0;
  });

  // Trier les frameworks par ordre chronologique
  const frameworkOrder = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];
  const frameworks = frameworkOrder.filter((name) => dataByFramework[name]).map((name) => dataByFramework[name]);

  if (frameworks.length === 0) {
    return { fr: <></>, en: <></> };
  }

  // Calculer l'évolution entre le premier et le dernier framework
  const firstFramework = frameworks[0];
  const lastFramework = frameworks[frameworks.length - 1];
  const evolutionPercent = (((lastFramework.avgFundingPerYear - firstFramework.avgFundingPerYear) / firstFramework.avgFundingPerYear) * 100).toFixed(
    1
  );
  const evolutionDirection = parseFloat(evolutionPercent) >= 0 ? "augmentation" : "diminution";
  const evolutionDirectionEn = parseFloat(evolutionPercent) >= 0 ? "increase" : "decrease";

  // Identifier le framework avec le financement annuel moyen le plus élevé
  const bestFramework = frameworks.reduce(
    (max: FrameworkData, current: FrameworkData) => (current.avgFundingPerYear > max.avgFundingPerYear ? current : max),
    frameworks[0]
  );

  const formatToMillions = (value: number) => {
    const millions = value / 1000000;
    return `${millions.toFixed(2)} M€`;
  };

  const fr = (
    <>
      De <strong>{firstFramework.framework}</strong> à <strong>{lastFramework.framework}</strong>, le financement annuel moyen est passé de{" "}
      <strong>{formatToMillions(firstFramework.avgFundingPerYear)}</strong> à <strong>{formatToMillions(lastFramework.avgFundingPerYear)}</strong>,
      soit une {evolutionDirection} de <strong>{Math.abs(parseFloat(evolutionPercent))}%</strong>. Le programme{" "}
      <strong>{bestFramework.framework}</strong> présente le financement annuel moyen le plus élevé avec{" "}
      <strong>{formatToMillions(bestFramework.avgFundingPerYear)}</strong> par an sur <strong>{bestFramework.years.length}</strong> année
      {bestFramework.years.length > 1 ? "s" : ""}.
    </>
  );

  const en = (
    <>
      From <strong>{firstFramework.framework}</strong> to <strong>{lastFramework.framework}</strong>, the average annual funding went from{" "}
      <strong>{formatToMillions(firstFramework.avgFundingPerYear)}</strong> to <strong>{formatToMillions(lastFramework.avgFundingPerYear)}</strong>,
      representing a {evolutionDirectionEn} of <strong>{Math.abs(parseFloat(evolutionPercent))}%</strong>. The{" "}
      <strong>{bestFramework.framework}</strong> program has the highest average annual funding with{" "}
      <strong>{formatToMillions(bestFramework.avgFundingPerYear)}</strong> per year over <strong>{bestFramework.years.length}</strong> year
      {bestFramework.years.length > 1 ? "s" : ""}.
    </>
  );

  return {
    fr: fr,
    en: en,
  };
}

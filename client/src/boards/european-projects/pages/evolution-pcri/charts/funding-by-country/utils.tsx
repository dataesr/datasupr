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

/**
 * Génère un composant de tableau accessible avec les données de financement par année et par framework
 * @param data - Les données brutes de l'évolution du financement par pays
 * @param currentLang - La langue actuelle ('fr' ou 'en')
 * @returns Un composant JSX de tableau accessible ou un message si aucune donnée n'est disponible
 */
export function renderDataTable(data: { call_year: string; framework: string; funding: number; project_number: number }[], currentLang: string = "fr") {
  const { getI18nLabel } = require("../../../../../../utils");
  const i18n = require("../../../../i18n-global.json");
  
  if (!data || data.length === 0) {
    return <div className="fr-text--center fr-py-3w">{getI18nLabel(i18n, "no-data-table")}</div>;
  }

  interface YearData {
    year: string;
    framework: string;
    funding: number;
    projects: number;
  }

  // Grouper les données par année
  const dataByYear: Record<string, YearData> = data.reduce((acc, item) => {
    if (!acc[item.call_year]) {
      acc[item.call_year] = {
        year: item.call_year,
        framework: item.framework,
        funding: 0,
        projects: 0,
      };
    }
    acc[item.call_year].funding += item.funding || 0;
    acc[item.call_year].projects += item.project_number || 0;
    return acc;
  }, {} as Record<string, YearData>);

  // Convertir en tableau et trier par année
  const sortedData = Object.values(dataByYear).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Grouper par framework pour calculer les totaux
  const frameworkOrder = ["FP6", "FP7", "Horizon 2020", "Horizon Europe"];
  
  interface FrameworkSummary {
    framework: string;
    totalFunding: number;
    totalProjects: number;
    years: number;
  }

  const frameworkSummaries: Record<string, FrameworkSummary> = {};
  
  sortedData.forEach((item) => {
    if (!frameworkSummaries[item.framework]) {
      frameworkSummaries[item.framework] = {
        framework: item.framework,
        totalFunding: 0,
        totalProjects: 0,
        years: 0,
      };
    }
    frameworkSummaries[item.framework].totalFunding += item.funding;
    frameworkSummaries[item.framework].totalProjects += item.projects;
    frameworkSummaries[item.framework].years += 1;
  });

  const formatToMillions = (value: number) => {
    const millions = value / 1000000;
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2 
    }).format(millions);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US").format(value);
  };

  const labels = {
    year: getI18nLabel(i18n, "year"),
    framework: getI18nLabel(i18n, "framework"),
    funding: getI18nLabel(i18n, "funding"),
    projects: getI18nLabel(i18n, "projects"),
    unit: "M€",
    summaryTitle: getI18nLabel(i18n, "summary-by-framework"),
    total: getI18nLabel(i18n, "total"),
    avgPerYear: getI18nLabel(i18n, "average-per-year"),
    caption: getI18nLabel(i18n, "caption-pillar-evolution"),
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Tableau principal : données par année */}
      <div className="fr-table-responsive fr-mb-4w">
        <table
          className="fr-table fr-table--bordered fr-table--sm"
          style={{ width: "100%" }}
        >
          <caption className="fr-sr-only">{labels.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{labels.year}</th>
              <th scope="col">{labels.framework}</th>
              <th scope="col">{labels.funding}</th>
              <th scope="col">{labels.projects}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <th scope="row">{item.year}</th>
                <td>{item.framework}</td>
                <td>{formatToMillions(item.funding)} {labels.unit}</td>
                <td>{formatNumber(item.projects)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tableau récapitulatif par framework */}
      <div className="fr-table-responsive">
        <h4 className="fr-h6 fr-mb-2w">{labels.summaryTitle}</h4>
        <table
          className="fr-table fr-table--bordered fr-table--sm"
          style={{ width: "100%" }}
        >
          <caption className="fr-sr-only">{labels.summaryTitle}</caption>
          <thead>
            <tr>
              <th scope="col">{labels.framework}</th>
              <th scope="col">{labels.total} {labels.funding}</th>
              <th scope="col">{labels.avgPerYear}</th>
              <th scope="col">{labels.total} {labels.projects}</th>
            </tr>
          </thead>
          <tbody>
            {frameworkOrder
              .filter((fw) => frameworkSummaries[fw])
              .map((fw) => {
                const summary = frameworkSummaries[fw];
                const avgFunding = summary.years > 0 ? summary.totalFunding / summary.years : 0;
                return (
                  <tr key={fw}>
                    <th scope="row">{fw}</th>
                    <td><strong>{formatToMillions(summary.totalFunding)} {labels.unit}</strong></td>
                    <td>{formatToMillions(avgFunding)} {labels.unit}</td>
                    <td>{formatNumber(summary.totalProjects)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

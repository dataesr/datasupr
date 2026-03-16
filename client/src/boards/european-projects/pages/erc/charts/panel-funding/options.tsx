import HighchartsInstance from "highcharts";

import { formatToMillions } from "../../../../../../utils/format";
import { CreateChartOptions } from "../../../../components/chart-ep";
import type { PanelFundingItem } from "./query";

// Variables CSS pour les couleurs par domaine scientifique
const DOMAIN_CSS_VARS: Record<string, string> = {
  LS: "--erc-domain-ls-color",
  PE: "--erc-domain-pe-color",
  SH: "--erc-domain-sh-color",
};

// Récupère la couleur CSS pour un domaine
function getDomainColor(domain: string): string {
  const cssVar = DOMAIN_CSS_VARS[domain];
  if (!cssVar) return "#666666";
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || "#666666";
}

// Formes par type de financement
const DESTINATION_MARKERS: Record<string, HighchartsInstance.SymbolKeyValue> = {
  ADG: "triangle", // Advanced grants
  COG: "square", // Consolidator grants
  STG: "circle", // Starting grants
  SYG: "diamond", // Synergy grants
  POC: "triangle-down", // Proof of Concept
};

// Labels des domaines scientifiques
const DOMAIN_LABELS: Record<string, { fr: string; en: string }> = {
  LS: { fr: "Sciences de la vie", en: "Life Sciences" },
  PE: { fr: "Sciences physiques et ingénierie", en: "Physical Sciences and Engineering" },
  SH: { fr: "Sciences sociales et humaines", en: "Social Sciences and Humanities" },
};

// Labels des types de financement
const DESTINATION_LABELS: Record<string, { fr: string; en: string }> = {
  ADG: { fr: "Advanced grants (ADG)", en: "Advanced grants (ADG)" },
  COG: { fr: "Consolidator grants (COG)", en: "Consolidator grants (COG)" },
  STG: { fr: "Starting grants (STG)", en: "Starting grants (STG)" },
  SYG: { fr: "Synergy grants (SYG)", en: "Synergy grants (SYG)" },
  POC: { fr: "Proof of Concept (POC)", en: "Proof of Concept (POC)" },
};

interface OptionsParams {
  data: PanelFundingItem[];
  countryAdjective?: string;
  currentLang?: string;
}

export default function Options({ data, countryAdjective = "", currentLang = "fr" }: OptionsParams) {
  if (!data || data.length === 0) return null;

  // Filtrer les données avec domaine_scientifique valide (LS, PE, SH)
  const validDomains = ["LS", "PE", "SH"];
  const filteredData = data.filter((item) => validDomains.includes(item.domaine_scientifique));

  if (filteredData.length === 0) return null;

  // Cumuler les données par domaine et destination (pas par panel individuel)
  const aggregatedMap = new Map<
    string,
    {
      domain: string;
      destination: string;
      domainName: string;
      destinationName: string;
      totalFunding: number;
      totalPi: number;
    }
  >();

  filteredData.forEach((item) => {
    const key = `${item.domaine_scientifique}-${item.destination_code}`;
    if (!aggregatedMap.has(key)) {
      aggregatedMap.set(key, {
        domain: item.domaine_scientifique,
        destination: item.destination_code,
        domainName: item.domaine_name_scientifique,
        destinationName: item.destination_name_en,
        totalFunding: 0,
        totalPi: 0,
      });
    }

    const agg = aggregatedMap.get(key)!;
    agg.totalFunding += item.total_funding_entity;
    agg.totalPi += item.total_pi;
  });

  // Créer les séries Highcharts (une série par domaine pour la couleur)
  const domainSeries = new Map<string, any[]>();

  Array.from(aggregatedMap.values()).forEach((agg) => {
    if (!domainSeries.has(agg.domain)) {
      domainSeries.set(agg.domain, []);
    }

    domainSeries.get(agg.domain)!.push({
      x: agg.totalPi,
      y: agg.totalFunding / 1000000, // Convertir en millions
      name: `${DOMAIN_LABELS[agg.domain]?.[currentLang] || agg.domain} - ${agg.destination}`,
      domainName: agg.domainName,
      destinationName: agg.destinationName,
      destination: agg.destination,
      marker: {
        symbol: DESTINATION_MARKERS[agg.destination] || "circle",
        radius: 10,
        lineWidth: 1,
        lineColor: "#ffffff",
      },
    });
  });

  // Créer les séries finales
  const series: HighchartsInstance.SeriesOptionsType[] = Array.from(domainSeries.entries()).map(([domain, points]) => ({
    type: "scatter" as const,
    name: DOMAIN_LABELS[domain]?.[currentLang] || domain,
    color: getDomainColor(domain),
    data: points,
  }));

  // Calculer les valeurs max et moyennes basées sur les données agrégées
  const aggregatedValues = Array.from(aggregatedMap.values());
  const maxX = Math.max(...aggregatedValues.map((d) => d.totalPi)) * 1.1;
  const maxY = Math.max(...aggregatedValues.map((d) => d.totalFunding / 1000000)) * 1.1;

  // Moyennes basées sur les points agrégés (domaine x destination)
  const avgX = aggregatedValues.reduce((sum, d) => sum + d.totalPi, 0) / aggregatedValues.length;
  const avgY = aggregatedValues.reduce((sum, d) => sum + d.totalFunding, 0) / aggregatedValues.length / 1000000;

  // Titre dynamique
  const titleText =
    currentLang === "fr"
      ? `Financements obtenus par porteurs de projets ${countryAdjective} ventilés par panel et type de financement`
      : `Funding obtained by ${countryAdjective} project PIs by panel and funding type`;

  const newOptions: HighchartsInstance.Options = {
    chart: {
      height: 500,
    },
    title: {
      text: titleText,
      style: {
        fontSize: "14px",
        fontWeight: "600",
      },
    },
    xAxis: {
      title: {
        text: currentLang === "fr" ? "Nombre de porteurs de projets PI" : "Number of project PIs",
        style: { fontSize: "13px" },
      },
      min: 0,
      max: maxX,
      gridLineWidth: 0,
      plotLines: [
        {
          color: "#999999",
          dashStyle: "Dot",
          width: 1,
          value: avgX,
          label: {
            text: currentLang === "fr" ? "Moyenne" : "Average",
            align: "center",
            y: -5,
            style: {
              fontSize: "11px",
              color: "#666666",
            },
          },
          zIndex: 3,
        },
      ],
    },
    yAxis: {
      title: {
        text: currentLang === "fr" ? "Financements (M€)" : "Funding (M€)",
        style: { fontSize: "13px" },
      },
      min: 0,
      max: maxY,
      gridLineWidth: 0.5,
      gridLineColor: "#e0e0e0",
      plotLines: [
        {
          color: "#999999",
          dashStyle: "Dot",
          width: 1,
          value: avgY,
          label: {
            text: currentLang === "fr" ? "Moyenne" : "Average",
            align: "left",
            x: 5,
            style: {
              fontSize: "11px",
              color: "#666666",
            },
          },
          zIndex: 3,
        },
      ],
    },
    tooltip: {
      useHTML: true,
      headerFormat: "",
      pointFormatter: function (this: any) {
        return `
          <b>${this.name}</b><br/>
          ${currentLang === "fr" ? "Domaine" : "Domain"}: ${this.domainName}<br/>
          ${currentLang === "fr" ? "Type" : "Type"}: ${this.destinationName}<br/>
          ${currentLang === "fr" ? "Financements" : "Funding"}: <b>${formatToMillions(this.y * 1000000)}</b><br/>
          ${currentLang === "fr" ? "Nombre de PI" : "Number of PIs"}: <b>${this.x}</b>
        `;
      },
    },
    legend: {
      enabled: false, // Légende personnalisée affichée en dehors du graphique
      itemStyle: {
        fontSize: "11px",
      },
    },
    plotOptions: {
      scatter: {
        marker: {
          states: {
            hover: {
              enabled: true,
              lineColor: "#000000",
              lineWidth: 2,
            },
          },
        },
      },
    },
    series,
  };

  return CreateChartOptions("scatter", newOptions);
}

/**
 * Génère les items de légende personnalisés pour les domaines et types de financement
 */
export function getLegendItems(currentLang: string = "fr") {
  const domainItems = Object.entries(DOMAIN_LABELS).map(([key, label]) => ({
    type: "domain" as const,
    key,
    label: label[currentLang] || label.fr,
    color: getDomainColor(key),
  }));

  const destinationItems = Object.entries(DESTINATION_LABELS)
    .filter(([key]) => ["ADG", "COG", "STG"].includes(key)) // Filtrer les principaux types
    .map(([key, label]) => ({
      type: "destination" as const,
      key,
      label: label[currentLang] || label.fr,
      marker: DESTINATION_MARKERS[key],
    }));

  return { domainItems, destinationItems };
}

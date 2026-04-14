import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import { CreateChartOptions } from "../../../../components/chart-ep";
import { getCssColor } from "../../../../../../utils/colors";
import type { GenderByDomainData, GenderDomainItem } from "./query";

const DOMAIN_ORDER = ["LS", "PE", "SH"];

const DOMAIN_LABELS: Record<string, { fr: string; en: string }> = {
  LS: { fr: "Sciences de la vie (LS)", en: "Life Sciences (LS)" },
  PE: { fr: "Sciences physiques & ingénierie (PE)", en: "Physical Sciences & Engineering (PE)" },
  SH: { fr: "Sciences sociales & humaines (SH)", en: "Social Sciences & Humanities (SH)" },
};

function getPercent(item: GenderDomainItem, gender: string): number {
  const found = item.genders.find((g) => g.gender === gender);
  if (!found || !item.total) return 0;
  return Math.round((found.count / item.total) * 1000) / 10;
}

function sortGroups(items: GenderDomainItem[]): GenderDomainItem[] {
  // Trier d'abord par domaine (LS, PE, SH), puis alphabétiquement par group
  return [...items].sort((a, b) => {
    const domainA = DOMAIN_ORDER.indexOf(a.domain);
    const domainB = DOMAIN_ORDER.indexOf(b.domain);
    if (domainA !== domainB) return domainA - domainB;
    return a.group.localeCompare(b.group);
  });
}

export default function Options(data: GenderByDomainData, currentLang: string, panelNames: Record<string, string> = {}): Highcharts.Options | null {
  if (!data?.byGroup?.length) return null;

  const sorted = sortGroups(data.byGroup);
  const categories = sorted.map((d) => {
    if (DOMAIN_LABELS[d.group]) {
      return DOMAIN_LABELS[d.group][currentLang as "fr" | "en"];
    }
    return panelNames[d.group] ? `${d.group} — ${panelNames[d.group]}` : d.group;
  });

  // Colorer chaque barre selon le domaine
  const femaleData = sorted.map((d) => ({
    y: getPercent(d, "female"),
    custom: { count: d.genders.find((g) => g.gender === "female")?.count ?? 0, total: d.total },
  }));
  const maleData = sorted.map((d) => ({
    y: getPercent(d, "male"),
    custom: { count: d.genders.find((g) => g.gender === "male")?.count ?? 0, total: d.total },
  }));
  const nbData = sorted.map((d) => ({
    y: getPercent(d, "non binary"),
    custom: { count: d.genders.find((g) => g.gender === "non binary")?.count ?? 0, total: d.total },
  }));

  const newOptions: Highcharts.Options = {
    chart: {
      type: "bar",
      height: Math.max(300, sorted.length * 32 + 150),
    },
    legend: { enabled: true },
    xAxis: { categories },
    yAxis: {
      min: 0,
      max: 100,
      reversedStacks: false,
      title: { text: "%" },
      gridLineColor: "var(--background-default-grey-hover)",
      gridLineWidth: 0.5,
    },
    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}%</b> ({point.custom.count} / {point.custom.total})<br/>',
      shared: false,
    },
    plotOptions: {
      bar: {
        stacking: "percent",
        borderWidth: 0,
        borderRadius: 0,
        dataLabels: {
          enabled: true,
          format: "{y}%",
          style: { fontSize: "11px", fontWeight: "normal", textOutline: "none" },
        },
      },
    },
    series: [
      {
        type: "bar",
        name: currentLang === "fr" ? "% Femmes" : "% Women",
        color: getCssColor("women-color"),
        data: femaleData,
      },
      {
        type: "bar",
        name: currentLang === "fr" ? "% Hommes" : "% Men",
        color: getCssColor("men-color"),
        data: maleData,
      },
      {
        type: "bar",
        name: currentLang === "fr" ? "% Non binaire" : "% Non binary",
        color: getCssColor("unspecified-field-color"),
        data: nbData,
      },
    ],
  };

  return CreateChartOptions("bar", newOptions);
}

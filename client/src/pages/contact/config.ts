export const CONTACT_API = `${import.meta.env.VITE_APP_SERVER_URL}/contact`;

export const DASHBOARDS = [
  { value: "general", label: "Général" },
  { value: "structures-finance", label: "Structures finance" },
  { value: "financements-par-aap", label: "Financements par AAP" },
  { value: "atlas", label: "Atlas" },
  { value: "datasupr-doc", label: "Documentation" },
  { value: "european-projects", label: "Projets européens" },
  { value: "graduates", label: "Graduates" },
  { value: "open-alex", label: "OpenAlex" },
  { value: "personnel-enseignant", label: "Personnel enseignant" },
  { value: "teds", label: "TEDS" },
  {
    value: "valorisation-recherche-innovation",
    label: "Valorisation recherche innovation",
  },
  { value: "integration", label: "Intégration" },
] as const;

export type DashboardValue = (typeof DASHBOARDS)[number]["value"];

export const getDashboardLabel = (value: string): string =>
  DASHBOARDS.find((d) => d.value === value)?.label ?? "Général";

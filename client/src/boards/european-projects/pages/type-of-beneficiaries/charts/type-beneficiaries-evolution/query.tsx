import Cookies from "js-cookie";
const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string, entityType: string, selectedYears?: string[], allYears?: number[]) {
  if (params === "") {
    return [];
  }
  const searchParams = new URLSearchParams(params);

  // Ajouter le type d'entité directement
  searchParams.append("cordis_type_entity_code", entityType);

  const selectedPillars = Cookies.get("selectedPillars");
  if (selectedPillars) {
    searchParams.append("pillars", selectedPillars);
  }
  const selectedPrograms = Cookies.get("selectedPrograms");
  if (selectedPrograms) {
    searchParams.append("programs", selectedPrograms);
  }
  const selectedThematics = Cookies.get("selectedThematics");
  if (selectedThematics) {
    searchParams.append("thematics", selectedThematics);
  }
  const selectedDestinations = Cookies.get("selectedDestinations");
  if (selectedDestinations) {
    searchParams.append("destinations", selectedDestinations);
  }

  // Ajouter le filtre des années si elles ne sont pas toutes sélectionnées
  if (selectedYears && allYears && selectedYears.length > 0 && selectedYears.length < allYears.length) {
    searchParams.append("years", selectedYears.join("|"));
  }

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/type-beneficiaries/type-beneficiaries-evolution?${searchParams.toString()}`).then(
    (response) => response.json()
  );
}

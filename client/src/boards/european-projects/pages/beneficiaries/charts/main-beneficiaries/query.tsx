import Cookies from "js-cookie";
const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  const baseUrl = `${VITE_APP_SERVER_URL}/european-projects/beneficiaries/main-beneficiaries`;
  const searchParams = new URLSearchParams(params);

  // Récupérer les piliers sélectionnés depuis les cookies
  const selectedPillars = Cookies.get("selectedPillars");
  if (selectedPillars) {
    searchParams.append("pilier_code", selectedPillars);
  }
  // Récupérer les programmes sélectionnés depuis les cookies
  const selectedPrograms = Cookies.get("selectedPrograms");
  if (selectedPrograms) {
    searchParams.append("programme_code", selectedPrograms);
  }
  // Récupérer les thématiques sélectionnées depuis les cookies
  const selectedThematics = Cookies.get("selectedThematics");
  if (selectedThematics) {
    searchParams.append("thema_code", selectedThematics);
  }
  // Récupérer les destinations sélectionnées depuis les cookies
  const selectedDestinations = Cookies.get("selectedDestinations");
  if (selectedDestinations) {
    searchParams.append("destination_code", selectedDestinations);
  }

  const queryString = searchParams.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return fetch(finalUrl).then((response) => response.json());
}

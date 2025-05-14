import Cookies from "js-cookie";
const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  const baseUrl = `${VITE_APP_SERVER_URL}/european-projects/overview/projects-types-1`;
  const searchParams = new URLSearchParams(params);

  // Récupérer les piliers sélectionnés depuis les cookies
  const selectedPillars = Cookies.get("selectedPillars");
  if (selectedPillars) {
    searchParams.append("pilier_code", selectedPillars);
  }
  // Récupérer les programmes sélectionnés depuis les cookies
  const selectedPrograms = Cookies.get("selectedPrograms");
  if (selectedPrograms) {
    searchParams.append("program_code", selectedPrograms);
  }
  // Récupérer les topics sélectionnés depuis les cookies
  const selectedTopics = Cookies.get("selectedTopics");
  if (selectedTopics) {
    searchParams.append("topic_code", selectedTopics);
  }
  // Récupérer les destinations sélectionnés depuis les cookies
  const selectedDestinations = Cookies.get("selectedDestinations");
  if (selectedDestinations) {
    searchParams.append("destination_code", selectedDestinations);
  }
  const queryString = searchParams.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return fetch(finalUrl).then((response) => response.json());
}

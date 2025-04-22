import Cookies from "js-cookie";
const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  const baseUrl = `${VITE_APP_SERVER_URL}/european-projects/overview/topics-funding-evo-3-years`;
  const searchParams = new URLSearchParams(params);

  // Récupérer les piliers sélectionnés depuis les cookies
  const selectedThematics = Cookies.get("selectedThematics");
  if (selectedThematics) {
    searchParams.append("thema_code", selectedThematics);
  }

  const queryString = searchParams.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return fetch(finalUrl).then((response) => response.json());
}

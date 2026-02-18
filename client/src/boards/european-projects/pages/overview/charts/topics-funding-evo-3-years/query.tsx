const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  const baseUrl = `${VITE_APP_SERVER_URL}/european-projects/overview/topics-funding-evo-3-years`;
  const searchParams = new URLSearchParams(params);

  // Récupérer les thématiques sélectionnées depuis l'URL (séparées par ,) et les convertir en | pour l'API
  const thematicIds = searchParams.get("thematicIds");
  if (thematicIds) {
    searchParams.delete("thematicIds");
    searchParams.append("thema_code", thematicIds.split(",").join("|"));
  }

  const queryString = searchParams.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return fetch(finalUrl).then((response) => response.json());
}

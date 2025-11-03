const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  const baseUrl = `${VITE_APP_SERVER_URL}/european-projects/overview/pillars-funding-evo-3-years`;
  const searchParams = new URLSearchParams(params);

  // Récupérer le paramètre pillarId depuis l'URL et le convertir en pilier_code
  const pillarId = searchParams.get("pillarId");
  if (pillarId) {
    searchParams.delete("pillarId"); // Supprimer l'ancien paramètre
    searchParams.append("pilier_code", pillarId);
  }

  const queryString = searchParams.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return fetch(finalUrl).then((response) => response.json());
}

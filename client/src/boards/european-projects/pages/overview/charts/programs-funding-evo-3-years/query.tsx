const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  const baseUrl = `${VITE_APP_SERVER_URL}/european-projects/overview/programs-funding-evo-3-years`;
  const searchParams = new URLSearchParams(params);

  const programId = searchParams.get("programId");
  if (programId) {
    searchParams.delete("pillarId"); // Supprimer l'ancien paramètre
    searchParams.append("programme_code", programId);
  }

  const queryString = searchParams.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return fetch(finalUrl).then((response) => response.json());
}

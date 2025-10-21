const { VITE_APP_SERVER_URL } = import.meta.env;

export async function getCollaborations(params: string) {
  if (params === "") {
    return [];
  }
  return fetch(`${VITE_APP_SERVER_URL}/european-projects/collaborations/get-collaborations?${params}`).then((response) => response.json());
}

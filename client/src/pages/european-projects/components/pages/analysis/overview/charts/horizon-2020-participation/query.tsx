const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetHorizon2020Participation(params: string) {
  let url = `${VITE_APP_SERVER_URL}/european-projects`;
  if (params !== '') {
    url = `${VITE_APP_SERVER_URL}/european-projects?${params}`;
  }

  return fetch(url).then((response) => (response.json()))
}
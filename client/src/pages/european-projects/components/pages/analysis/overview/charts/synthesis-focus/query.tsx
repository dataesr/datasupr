const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  let url = `${VITE_APP_SERVER_URL}/european-projects/analysis-synthese-focus`;
  if (params !== '') {
    url = `${VITE_APP_SERVER_URL}/european-projects/analysis-synthese-focus?${params}`;
  }

  return fetch(url).then((response) => (response.json()))
}


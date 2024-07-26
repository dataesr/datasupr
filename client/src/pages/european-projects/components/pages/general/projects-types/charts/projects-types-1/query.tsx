const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  let url = `${VITE_APP_SERVER_URL}/european-projects/analysis-synthese-projects-types-1`;
  if (params !== '') {
    url = `${VITE_APP_SERVER_URL}/european-projects/analysis-synthese-projects-types-1?${params}`;
  }

  return fetch(url).then((response) => (response.json()))
}


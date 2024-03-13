const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetfundedObjectives(params: string) {
  let url = `${VITE_APP_SERVER_URL}/european-projects/analysis-synthese-funding_programme`;
  if (params !== '') {
    url = `${VITE_APP_SERVER_URL}/european-projects/analysis-synthese-funding_programme?${params}`;
  }

  return fetch(url).then((response) => (response.json()))
}


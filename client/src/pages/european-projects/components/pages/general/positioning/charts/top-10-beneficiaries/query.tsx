const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  const url = `${VITE_APP_SERVER_URL}/european-projects/analysis-positioning-top-10-beneficiaries${params ? (`?${params}`) : ''}`;

  return fetch(url).then((response) => (response.json()))
}
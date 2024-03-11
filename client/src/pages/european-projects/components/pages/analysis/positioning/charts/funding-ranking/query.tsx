const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData() {
  const url = `${VITE_APP_SERVER_URL}/european-projects/analysis-positioning-top-10-funding-ranking`;

  return fetch(url).then((response) => (response.json()))
}


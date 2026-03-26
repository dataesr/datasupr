const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  let url = `${VITE_APP_SERVER_URL}/european-projects/beneficiaries/beneficiaries-by-role`;
  if (params !== "") {
    url = `${url}?${params}`;
  }

  return fetch(url).then((response) => response.json());
}

const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  if (params === "") return [];

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/type-beneficiaries/top10-countries-by-type-of-beneficiaries?${params}`).then((response) =>
    response.json(),
  );
}

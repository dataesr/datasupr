const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(params: string) {
  let url = `${VITE_APP_SERVER_URL}/european-projects/general-projectsTypes-successRateForAmountsByPillar`;
  if (params !== "") {
    url = `${VITE_APP_SERVER_URL}/european-projects/general-projectsTypes-successRateForAmountsByPillar?${params}`;
  }

  return fetch(url).then((response) => response.json());
}

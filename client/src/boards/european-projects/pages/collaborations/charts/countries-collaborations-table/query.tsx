// import Cookies from "js-cookie";
const { VITE_APP_SERVER_URL } = import.meta.env;

export async function getCollaborations(params) {
  if (params === "") {
    return [];
  }

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/collaborations/get-collaborations?${params}`).then((response) => response.json());
}

export async function getCollaborationsByCountry(params, countryCodeCollab) {
  const queryParams = new URLSearchParams(params);
  queryParams.append("country_code_collab", countryCodeCollab);

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/collaborations/get-collaborations-by-country?${queryParams.toString()}`).then((response) =>
    response.json()
  );
}
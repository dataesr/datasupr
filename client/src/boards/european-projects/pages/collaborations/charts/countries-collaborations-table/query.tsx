// import Cookies from "js-cookie";
const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData(countryCode) {
  const queryParams = new URLSearchParams();

  // const selectedPillars = Cookies.get("selectedPillars");
  // if (selectedPillars) {
  //   queryParams.append("pillars", selectedPillars);
  // }
  // const selectedPrograms = Cookies.get("selectedPrograms");
  // if (selectedPrograms) {
  //   queryParams.append("programs", selectedPrograms);
  // }
  // const selectedThematics = Cookies.get("selectedThematics");
  // if (selectedThematics) {
  //   queryParams.append("thematics", selectedThematics);
  // }
  // const selectedDestinations = Cookies.get("selectedDestinations");
  // if (selectedDestinations) {
  //   queryParams.append("destination", selectedDestinations);
  // }
  if (countryCode) {
    queryParams.append("country_code", countryCode);
  }

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/collaborations/get-collaborations?${queryParams.toString()}`).then((response) =>
    response.json()
  );
}

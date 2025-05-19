import Cookies from "js-cookie";
const { VITE_APP_SERVER_URL } = import.meta.env;

export async function GetData() {
  const searchParams = new URLSearchParams();

const selectedPillars = Cookies.get("selectedPillars");
if (selectedPillars) {
  searchParams.append("pillars", selectedPillars);
}
const selectedPrograms = Cookies.get("selectedPrograms");
if (selectedPrograms) {
  searchParams.append("programs", selectedPrograms);
}
const selectedThematics = Cookies.get("selectedThematics");
if (selectedThematics) {
  searchParams.append("thematics", selectedThematics);
}
const selectedDestinations = Cookies.get("selectedDestinations");
if (selectedDestinations) {
  searchParams.append("destination", selectedDestinations);
}

  return fetch(`${VITE_APP_SERVER_URL}/european-projects/positioning/top-10-funding-ranking?${searchParams.toString()}`).then((response) =>
    response.json()
  );
}

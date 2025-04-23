import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

export function useGetParams() {
  const [searchParams] = useSearchParams();

  const params = [...searchParams]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  let cleanParams = params.replace(/[?&]language=(fr|en)/g, "");

  const selectedPillars = Cookies.get("selectedPillars");
  const selectedPrograms = Cookies.get("selectedPrograms");
  const selectedThematics = Cookies.get("selectedThematics");
  const selectedDestinations = Cookies.get("selectedDestinations");

  if (selectedPillars) {
    cleanParams += `&pillars=${selectedPillars}`;
  }
  if (selectedPrograms) {
    cleanParams += `&programs=${selectedPrograms}`;
  }
  if (selectedThematics) {
    cleanParams += `&thematics=${selectedThematics}`;
  }
  if (selectedDestinations) {
    cleanParams += `&destinations=${selectedDestinations}`;
  }
  cleanParams = cleanParams.startsWith("&")
    ? cleanParams.substring(1)
    : cleanParams;
  cleanParams = cleanParams.endsWith("&")
    ? cleanParams.substring(0, cleanParams.length - 1)
    : cleanParams;

  return cleanParams;
}

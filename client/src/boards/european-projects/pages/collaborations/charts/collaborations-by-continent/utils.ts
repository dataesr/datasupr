import { useSearchParams } from "react-router-dom";

export function useGetParams() {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams();

  const country_code = searchParams.get("country_code");
  const pillars = searchParams.get("pillars");
  const programs = searchParams.get("programs");
  const thematics = searchParams.get("thematics");
  const destinations = searchParams.get("destinations");

  if (country_code) params.append("country_code", country_code);
  if (pillars) params.append("pillars", pillars);
  if (programs) params.append("programs", programs);
  if (thematics) params.append("thematics", thematics);
  if (destinations) params.append("destinations", destinations);

  return params.toString();
}

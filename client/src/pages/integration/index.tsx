import { useSearchParams } from "react-router-dom";
import Template from "./template";

export default function Integration() {
  const [searchParams] = useSearchParams();
  // const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  const iso2 = searchParams.get('country_code') || 'FR';
  const chartId = searchParams.get('chart_id') || null;
  const theme = searchParams.get('theme') || 'light';

  document.documentElement.setAttribute('data-fr-theme', theme);

  if (!chartId) return <Template />;

  return (
    <>
      graph {iso2}
    </>
  );
}
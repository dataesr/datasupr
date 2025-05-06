import React, { Suspense } from "react";
import { useSearchParams } from "react-router-dom";

import Template from "./template";

export default function Integration() {
  const [searchParams] = useSearchParams();
  const chartId = searchParams.get("chart_id") || null;
  const theme = searchParams.get("theme") || "light";
  document.documentElement.setAttribute("data-fr-theme", theme);

  if (!chartId) return <Template />;

  const integrationURL = `url_de_${chartId}`;
  const LazyComponent = React.lazy(
    () => import(/* @vite-ignore */ integrationURL)
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

import React, { Suspense } from "react";
import { useSearchParams } from "react-router-dom";

import Template from "./template";

import { getConfig } from "../european-projects/utils";

export default function Integration() {
  const [searchParams] = useSearchParams();
  const chartId = searchParams.get('chart_id') || null;
  const theme = searchParams.get('theme') || 'light';
  document.documentElement.setAttribute('data-fr-theme', theme);

  if (!chartId) return <Template />;

  const config = getConfig(chartId);
  if (!config) {
    throw new Error(`No config found for chart id ${chartId}`);
  }

  const LazyComponent = React.lazy(() => import(config.integrationURL));
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
import { Route, Routes } from "react-router-dom";

import AdminRoutes from "./pages/admin/routes.tsx";
import AtlasRoutes from "./pages/atlas/routes.tsx";
import EuropeanProjectsRoutes from "./pages/european-projects/routes.tsx";
import HomePage from "./pages/home-page.tsx";
import Integration from "./pages/integration/index.tsx";
import OpenAlexRoutes from "./pages/open-alex/routes.tsx";
import TedsRoutes from "./pages/teds/routes.tsx";
import FinanceUniversityRoutes from "./pages/finance-university/routes.tsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/atlas/*" element={<AtlasRoutes />} />
      <Route path="/european-projects/*" element={<EuropeanProjectsRoutes />} />
      <Route
        path="/finance-universite/*"
        element={<FinanceUniversityRoutes />}
      />
      <Route path="/integration" element={<Integration />} />
      <Route path="/open-alex/*" element={<OpenAlexRoutes />} />
      <Route path="/teds/*" element={<TedsRoutes />} />
      <Route path="*" element={<div>404 atlas</div>} />
    </Routes>
  );
}

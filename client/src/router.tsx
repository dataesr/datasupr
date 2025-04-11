import { Route, Routes } from "react-router-dom";

import AdminRoutes from "./boards/admin/routes.tsx";
import AtlasRoutes from "./boards/atlas/routes.tsx";
import EuropeanProjectsRoutes from "./boards/european-projects/routes.tsx";
import PersonnelEnseignantsRoutes from "./boards/personnel-enseignants/routes.tsx";
import HomePage from "./boards/home-page.tsx";
import Integration from "./boards/integration/index.tsx";
import OpenAlexRoutes from "./boards/open-alex/routes.tsx";
import TedsRoutes from "./boards/teds/routes.tsx";
import FinanceUniversityRoutes from "./boards/finance-university/routes.tsx";
import NotFoundPage from "./components/not-found-page.tsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/atlas/*" element={<AtlasRoutes />} />
      <Route path="/european-projects/*" element={<EuropeanProjectsRoutes />} />
      <Route
        path="/personnel-enseignants/*"
        element={<PersonnelEnseignantsRoutes />}
      />
      <Route
        path="/finance-universite/*"
        element={<FinanceUniversityRoutes />}
      />
      <Route path="/integration" element={<Integration />} />
      <Route path="/open-alex/*" element={<OpenAlexRoutes />} />
      <Route path="/teds/*" element={<TedsRoutes />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

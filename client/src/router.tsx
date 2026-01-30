import { Navigate, Route, Routes } from "react-router-dom";

import AdminRoutes from "./boards/admin/routes.tsx";
import AtlasRoutes from "./boards/atlas/routes.tsx";
import DatasuprDocRoutes from "./boards/datasupr-doc/routes.tsx";
import EuropeanProjectsRoutes from "./boards/european-projects/routes.tsx";
import FacultyMembersRoutes from "./boards/faculty-members/routes.tsx";
import FundingsRoutes from "./boards/financements-par-aap/routes.tsx";
import GraduatesRoutes from "./boards/graduates/routes.tsx";
import HomePage from "./boards/home-page.tsx";
import Integration from "./boards/integration/index.tsx";
import OpenAlexRoutes from "./boards/open-alex/routes.tsx";
import StructuresFinanceRoutes from "./boards/structures-finance/routes.tsx";
import TedsRoutes from "./boards/teds/routes.tsx";
import TemplateRoutes from "./boards/template/routes.tsx";
import CookiePolicyPage from "./components/cookies/cookie-policy-page/index.tsx";
import NotFoundPage from "./components/not-found-page.tsx";


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/atlas/*" element={<AtlasRoutes />} />
      <Route path="/cookies" element={<CookiePolicyPage />} />
      <Route path="/datasupr-doc/*" element={<DatasuprDocRoutes />} />
      <Route
        path="/european-projects"
        element={<Navigate to="/european-projects/accueil" replace />}
      />
      <Route path="/european-projects/*" element={<EuropeanProjectsRoutes />} />
      <Route
        path="/financements-par-aap"
        element={<Navigate to="/financements-par-aap/accueil" replace />}
      />
      <Route path="/financements-par-aap/*" element={<FundingsRoutes />} />
      <Route path="/graduates/*" element={<GraduatesRoutes />} />
      <Route path="/integration" element={<Integration />} />
      <Route path="/open-alex/*" element={<OpenAlexRoutes />} />
      <Route path="/personnel-enseignant/*" element={<FacultyMembersRoutes />} />
      <Route path="/structures-finance/*" element={<StructuresFinanceRoutes />} />
      <Route
        path="/teds"
        element={<Navigate to="/teds/home" replace />}
      />
      <Route path="/teds/*" element={<TedsRoutes />} />
      <Route path="/template/*" element={<TemplateRoutes />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

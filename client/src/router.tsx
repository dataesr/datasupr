import { Route, Routes } from "react-router-dom";

import AdminRoutes from "./boards/admin/routes.tsx";
import AtlasRoutes from "./boards/atlas/routes.tsx";
import EuropeanProjectsRoutes from "./boards/european-projects/routes.tsx";
import HomePage from "./boards/home-page.tsx";
import Integration from "./boards/integration/index.tsx";
import OpenAlexRoutes from "./boards/open-alex/routes.tsx";
import TedsRoutes from "./boards/teds/routes.tsx";
// import FinanceUniversityRoutes from "./boards/finance-university/routes.tsx";
import GraduatesRoutes from "./boards/graduates/routes.tsx";
import NotFoundPage from "./components/not-found-page.tsx";
import FacultyMembersRoutes from "./boards/faculty-members/routes.tsx";
import CookiePolicyPage from "./components/cookies/cookie-policy-page/index.tsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/atlas/*" element={<AtlasRoutes />} />
      <Route path="/european-projects/*" element={<EuropeanProjectsRoutes />} />
      {/* <Route path="/finance-universite/*" element={<FinanceUniversityRoutes />} /> */}
      <Route path="/integration" element={<Integration />} />
      <Route path="/open-alex/*" element={<OpenAlexRoutes />} />
      <Route path="/personnel-enseignant/*" element={<FacultyMembersRoutes />} />
      <Route path="/teds/*" element={<TedsRoutes />} />
      <Route path="/graduates/*" element={<GraduatesRoutes />} />
      <Route path="/cookies" element={<CookiePolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

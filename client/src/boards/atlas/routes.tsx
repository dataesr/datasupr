import { Route, Routes } from "react-router-dom";

import NotFoundPage from "../../components/not-found-page.tsx";
import { Layout } from "./components/layout/layout.tsx";
import { OtherGeographicalLevels } from "./components/other-geographical-levels.tsx";
import { AtlasProvider } from "./context.tsx";
import AtlasHeader from "./index.tsx";
import { FieldsRouter } from "./pages/fields/index.tsx";
import { Genders } from "./pages/genders.tsx";
import { General } from "./pages/general.tsx";
import { Sectors } from "./pages/sectors.tsx";
import Accessibility from "./pages/static-pages/accessibility.tsx";
import Contact from "./pages/static-pages/contact.tsx";
import CookieManagement from "./pages/static-pages/cookie-management.tsx";
import LegalMentions from "./pages/static-pages/legal-mentions.tsx";
import SiteMap from "./pages/static-pages/site-map.tsx";

import "highcharts/modules/accessibility";
import "highcharts/modules/export-data";
import "highcharts/modules/exporting";
import Methodology from "./pages/static-pages/methodology.tsx";


export default function AtlasRoutes() {
  return (
    <AtlasProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AtlasHeader />}>
            <Route path="general" element={<General />} />
            <Route
              path="effectifs-par-filiere/:idFiliere?"
              element={<FieldsRouter />}
            />
            <Route path="effectifs-par-secteur" element={<Sectors />} />
            <Route path="effectifs-par-genre" element={<Genders />} />
            <Route
              path="autres-niveaux-geographiques"
              element={<OtherGeographicalLevels />}
            />
          </Route>
          <Route path="plan-du-site" element={<SiteMap />} />
          <Route path="methodologie" element={<Methodology />} />
          <Route path="accessibilite" element={<Accessibility />} />
          <Route path="mentions-legales" element={<LegalMentions />} />
          <Route path="gestion-des-cookies" element={<CookieManagement />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AtlasProvider>
  );
}

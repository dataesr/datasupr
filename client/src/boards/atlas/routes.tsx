import { Routes, Route } from "react-router-dom";

import AtlasHeader from "./index.tsx";
import { General } from "./pages/general.tsx";
import { FieldsRouter } from "./pages/fields/index.tsx";
import { Sectors } from "./pages/sectors.tsx";
import { Genders } from "./pages/genders.tsx";
import { OtherGeographicalLevels } from "./components/other-geographical-levels.tsx";
import { Layout } from "./components/layout/layout.tsx";
import SiteMap from "./pages/static-pages/site-map.tsx";
import Accessibility from "./pages/static-pages/accessibility.tsx";
import LegalMentions from "./pages/static-pages/legal-mentions.tsx";
import CookieManagement from "./pages/static-pages/cookie-management.tsx";
import Contact from "./pages/static-pages/contact.tsx";
import { AtlasProvider } from "./context.tsx";

import Highcharts from "highcharts";
import HCAccessibility from "highcharts/modules/accessibility";
import HCExporting from "highcharts/modules/exporting";
import HCExportingData from "highcharts/modules/export-data";
import Methodology from "./pages/static-pages/methodology.tsx";
HCAccessibility(Highcharts);
HCExporting(Highcharts);
HCExportingData(Highcharts);

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
      </Routes>
    </AtlasProvider>
  );
}

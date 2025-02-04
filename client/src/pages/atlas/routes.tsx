import { Routes, Route } from "react-router-dom";

import AtlasHeader from "./index.tsx";
import { General } from "./components/main/tabs/general.tsx";
import { FieldsRouter } from "./components/main/tabs/fields/index.tsx";
import { Sectors } from "./components/main/tabs/sectors.tsx";
import { Genders } from "./components/main/tabs/genders.tsx";
import { OtherGeographicalLevels } from "./components/main/tabs/other-geographical-levels.tsx";
import { Layout } from "./components/layout/layout.tsx";
import SiteMap from "./components/static-pages/site-map.tsx";
import Accessibility from "./components/static-pages/accessibility.tsx";
import LegalMentions from "./components/static-pages/legal-mentions.tsx";
import CookieManagement from "./components/static-pages/cookie-management.tsx";
import Contact from "./components/static-pages/contact.tsx";

export default function AtlasRoutes() {
  return (
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
        <Route path="accessibilite" element={<Accessibility />} />
        <Route path="mentions-legales" element={<LegalMentions />} />
        <Route path="gestion-des-cookies" element={<CookieManagement />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

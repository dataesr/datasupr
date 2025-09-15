import { Route, Routes } from "react-router-dom";
import { FacultyMembers } from "./index.tsx";
import { FacultyLayout } from "./layout/index.tsx";

import UniversityOverview from "./pages/university/university-overview.tsx";
import FieldsOverview from "./pages/fields/fields-overview.tsx";
import { Evolution } from "./pages/evolutions/index.tsx";
import { ResearchTeachers } from "./pages/research-teachers/index.tsx";
import RegionsOverview from "./pages/geo/geo-overview.tsx";
import { Layout } from "../../layout/layout.tsx";
import { Typologie } from "./pages/typology/index.tsx";
import Glossary from "./components/glossary/index.tsx";

export default function FacultyMembersRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<FacultyMembers />} />
        <Route element={<FacultyLayout />}>
          {/* ROUTES POUR LA GEO */}
          <Route path="/geo/vue-d'ensemble/" element={<RegionsOverview />} />
          <Route path="/geo/evolution/" element={<Evolution />} />
          <Route path="/geo/typologie/" element={<Typologie />} />
          <Route
            path="/geo/enseignants-permanents/"
            element={<ResearchTeachers />}
          />

          {/* ROUTES POUR LES UNIVERSITES */}
          <Route
            path="/universite/vue-d'ensemble/"
            element={<UniversityOverview />}
          />
          <Route path="/universite/evolution/" element={<Evolution />} />
          <Route path="/universite/typologie/" element={<Typologie />} />
          <Route
            path="/universite/enseignants-permanents/"
            element={<ResearchTeachers />}
          />

          {/* ROUTES POUR LES DISCIPLINES */}
          <Route
            path="/discipline/vue-d'ensemble/"
            element={<FieldsOverview />}
          />
          <Route path="/discipline/evolution/" element={<Evolution />} />
          <Route path="/discipline/typologie/" element={<Typologie />} />
          <Route
            path="/discipline/enseignants-permanents/"
            element={<ResearchTeachers />}
          />
          {/* GLOSSAIRE */}
          <Route path="/glossaire/" element={<Glossary />} />
        </Route>
      </Route>
    </Routes>
  );
}

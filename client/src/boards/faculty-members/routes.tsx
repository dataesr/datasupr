import { Route, Routes } from "react-router-dom";
import { Layout } from "../../layout/layout.tsx";
import { FacultyMembers } from "./index.tsx";
import { FacultyLayout } from "./layout/index.tsx";

import GeoOverview from "./pages/geo/geo-overview.tsx";

import UniversityOverview from "./pages/university/university-overview.tsx";

import FieldsOverview from "./pages/fields/fields-overview.tsx";
import { GeoEvolution } from "./pages/geo/evolutions/index.tsx";
import { GeoTypologie } from "./pages/geo/typology/index.tsx";
import { UniversityEvolution } from "./pages/university/evolutions/index.tsx";
import { UniversityTypologie } from "./pages/university/typology/index.tsx";
import { FieldsEvolution } from "./pages/fields/evolutions/index.tsx";
import { FieldsTypologie } from "./pages/fields/typology/index.tsx";
import SpecificGeoOverview from "./pages/geo/geo-overview-by-id.tsx";
import { UniversityFields } from "./pages/university/fields/index.tsx";
import { GeoFields } from "./pages/geo/fields/index.tsx";
import SpecificFieldsOverview from "./pages/fields/fields-overview-by-id.tsx";
import SpecificUniversityOverview from "./pages/university/univ-overview-by-id.tsx";
import { ResearchTeachers } from "./pages/fields/research-teachers/index.tsx";

export default function FacultyMembersRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<FacultyMembers />} />
        <Route element={<FacultyLayout />}>
          {/* ROUTE POUR LA GEO */}
          <Route path="/geo/vue-d'ensemble/" element={<GeoOverview />} />
          <Route
            path="/geo/vue-d'ensemble/:geo_id"
            element={<SpecificGeoOverview />}
          />
          <Route path="/geo/evolution/:geo_id" element={<GeoEvolution />} />
          <Route path="/geo/evolution/" element={<GeoEvolution />} />
          <Route path="/geo/typologie/:geo_id" element={<GeoTypologie />} />
          <Route path="/geo/typologie/" element={<GeoTypologie />} />
          <Route path="/geo/discipline/:geo_id" element={<GeoFields />} />
          <Route path="/geo/discipline/" element={<GeoFields />} />

          {/* ROUTE POUR LES UNIVERSITES */}
          <Route
            path="/universite/vue-d'ensemble/:id"
            element={<SpecificUniversityOverview />}
          />
          <Route
            path="/universite/vue-d'ensemble/"
            element={<UniversityOverview />}
          />
          <Route
            path="/universite/evolution/:id"
            element={<UniversityEvolution />}
          />
          <Route
            path="/universite/evolution/"
            element={<UniversityEvolution />}
          />
          <Route
            path="/universite/discipline/:id"
            element={<UniversityFields />}
          />
          <Route
            path="/universite/discipline/"
            element={<UniversityFields />}
          />
          <Route
            path="/universite/typologie/:id"
            element={<UniversityTypologie />}
          />
          <Route
            path="/universite/typologie/"
            element={<UniversityTypologie />}
          />

          {/* ROUTE POUR LES DISCIPLINES */}
          <Route
            path="/discipline/vue-d'ensemble/"
            element={<FieldsOverview />}
          />
          <Route
            path="/discipline/vue-d'ensemble/:fieldId"
            element={<SpecificFieldsOverview />}
          />
          <Route
            path="/discipline/evolution/:fieldId"
            element={<FieldsEvolution />}
          />
          <Route path="/discipline/evolution/" element={<FieldsEvolution />} />

          <Route
            path="/discipline/typologie/:fieldId"
            element={<FieldsTypologie />}
          />
          <Route path="/discipline/typologie/" element={<FieldsTypologie />} />
          <Route
            path="/discipline/enseignants-chercheurs/"
            element={<ResearchTeachers />}
          />
          <Route
            path="/discipline/enseignants-chercheurs/:fieldId"
            element={<ResearchTeachers />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

import { Route, Routes } from "react-router-dom";
import { Layout } from "../../layout/layout.tsx";
import { FacultyMembers } from "./index.tsx";
import { FacultyLayout } from "./layout/index.tsx";

import GeoOverview from "./pages/geo/geo-overview.tsx";

import UniversityOverview from "./pages/university/university-overview.tsx";

import FieldsOverview from "./pages/fields/fields-overview.tsx";
import { GeoEvolution } from "./pages/geo/evolutions/index.tsx";
import { GeoTopologie } from "./pages/geo/topology/index.tsx";
import { UniversityEvolution } from "./pages/university/evolutions/index.tsx";
import { UniversityTopologie } from "./pages/university/topology/index.tsx";
import { FieldsEvolution } from "./pages/fields/evolutions/index.tsx";
import { FieldsTopologie } from "./pages/fields/topology/index.tsx";
import SpecificGeoOverview from "./pages/geo/geo-overview-by-id.tsx";
import { SpecificUniversityOverview } from "./pages/university/univ-overview-by-id.tsx";
import { SpecificFieldsOverview } from "./pages/fields/fields-overview-by-id.tsx";
import { UniversityFields } from "./pages/university/fields/index.tsx";
import { GeoFields } from "./pages/geo/fields/index.tsx";

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
          <Route path="/geo/topologie/:geo_id" element={<GeoTopologie />} />
          <Route path="/geo/topologie/" element={<GeoTopologie />} />
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
            path="/universite/topologie/:id"
            element={<UniversityTopologie />}
          />
          <Route
            path="/universite/topologie/"
            element={<UniversityTopologie />}
          />

          {/* ROUTE POUR LES DISCIPLINES */}
          <Route
            path="/discipline/vue-d'ensemble/"
            element={<FieldsOverview />}
          />
          <Route
            path="/discipline/vue-d'ensemble/:id"
            element={<SpecificFieldsOverview />}
          />
          <Route
            path="/discipline/evolution/:id"
            element={<FieldsEvolution />}
          />
          <Route path="/discipline/evolution/" element={<FieldsEvolution />} />

          <Route
            path="/discipline/topologie/:id"
            element={<FieldsTopologie />}
          />
          <Route path="/discipline/topologie/" element={<FieldsTopologie />} />
        </Route>
      </Route>
    </Routes>
  );
}

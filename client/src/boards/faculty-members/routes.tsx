import { Route, Routes } from "react-router-dom";

import { Layout } from "../../layout/layout.tsx";
import { Fields } from "./pages/fields/fields/index.tsx";
import { Evolution } from "./pages/fields/evolutions/index.tsx";
import { Topologie } from "./pages/fields/topology/index.tsx";
import { FacultyMembers } from "./index.tsx";
import { FacultyLayout } from "./layout/index.tsx";
import GeoOverview from "./pages/geo/geo-overview.tsx";
import UniversityOverview from "./pages/university/university-overview.tsx";
import FieldsOverview from "./pages/fields/fields-overview.tsx";
import SpecificGeoOverview from "./pages/geo/geo-overview-by-id.tsx";

export default function FacultyMembersRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<FacultyLayout />}>
          <Route path="/" element={<FacultyMembers />} />
          <Route path="/discipline" element={<Fields />} />
          <Route path="/evolution" element={<Evolution />} />
          <Route path="/topologie" element={<Topologie />} />
          <Route path="/vue-d'ensemble/geo" element={<GeoOverview />} />
          <Route
            path="/vue-d'ensemble/geo/:geoId"
            element={<SpecificGeoOverview />}
          />
          <Route
            path="/vue-d'ensemble/universite"
            element={<UniversityOverview />}
          />
          <Route
            path="/vue-d'ensemble/discipline"
            element={<FieldsOverview />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

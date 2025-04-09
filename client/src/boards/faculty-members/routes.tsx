import { Route, Routes } from "react-router-dom";

import { Layout } from "../../layout/layout.tsx";
import { Fields } from "./pages/fields/index.tsx";
import { Evolution } from "./pages/evolutions/index.tsx";
import { Topologie } from "./pages/topology/index.tsx";
import Overview from "./pages/overview/index.tsx";
import { FacultyMembers } from "./index.tsx";
import { FacultyLayout } from "./layout/index.tsx";

export default function FacultyMembersRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<FacultyLayout />}>
          <Route path="/" element={<FacultyMembers />} />
          <Route path="/discipline" element={<Fields />} />
          <Route path="/vue-d'ensemble" element={<Overview />} />
          <Route path="/evolution" element={<Evolution />} />
          <Route path="/topologie" element={<Topologie />} />
        </Route>
      </Route>
    </Routes>
  );
}

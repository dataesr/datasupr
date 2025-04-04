import { Route, Routes } from "react-router-dom";

import { Layout } from "../../layout/layout.tsx";
import FacultyMembers from "./index.tsx";
import { Fields } from "./pages/fields.tsx";
import { Evolution } from "./pages/evolution.tsx";
import { Topologie } from "./pages/topology.tsx";
import { Presentation } from "./pages/index.tsx";

export default function FacultyMembersRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Presentation />} />
        <Route path="/discipline" element={<Fields />} />
        <Route path="/vue-d'ensemble" element={<FacultyMembers />} />
        <Route path="/evolution" element={<Evolution />} />
        <Route path="/topologie" element={<Topologie />} />
      </Route>
    </Routes>
  );
}

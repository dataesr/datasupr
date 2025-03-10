import { Routes, Route, Navigate } from "react-router-dom";

import Main from "./index.tsx";
import Beneficiaries from "./components/pages/beneficiaries/index.tsx";
import Overview from "./components/pages/overview/index.tsx";
import Positioning from "./components/pages/positioning/index.tsx";
import ProjectsTypes from "./components/pages/projects-types/index.tsx";
import { Layout } from "../../layout/Layout.tsx";
import Informations from "./components/pages/informations.tsx";

export default function EuropeanProjectsRoutes() {
  return (
    <Routes>
      <Route element={<Layout languageSelector />}>
        <Route path="/" element={<Main />}>
          <Route index element={<Navigate to="synthese" replace />} />
          <Route path="synthese" element={<Overview />} />
          <Route path="positionnement" element={<Positioning />} />
          <Route path="collaborations" element={<div>Collaborations</div>} />
          <Route path="evolution" element={<div>Evolution</div>} />
          <Route path="objectifs-types-projets" element={<ProjectsTypes />} />
          <Route path="beneficiaires" element={<Beneficiaries />} />
          <Route path="programme-mires" element={<div>Programme MIRES</div>} />
          <Route path="appel-a-projets" element={<div>Appel à projets</div>} />
          <Route
            path="donnees-reference"
            element={<div>Données de référence</div>}
          />
          <Route path="informations" element={<Informations />} />
          {/* <Route
            path="/horizon-europe"
            element={<div>HE hors ERC & MSCA</div>}
            /> */}
          <Route path="/msca" element={<div>MSCA</div>} />
          <Route path="/erc" element={<div>ERC</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";

import Beneficiaries from "./pages/beneficiaries/index.tsx";
import Overview from "./pages/overview/index.tsx";
import Positioning from "./pages/positioning/index.tsx";
import ProjectsTypes from "./pages/projects-types/index.tsx";

import Informations from "./pages/informations.tsx";
import GlobalLayout from "./components/layouts/global-layout.tsx";
import Home from "./pages/home/index.tsx";
import Search from "./pages/search/index.tsx";
import SidemenuLayout from "./components/layouts/sidemenu-layout.tsx";

export default function EuropeanProjectsRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout languageSelector />}>
        <Route index element={<Navigate to="accueil" replace />} />
        <Route path="accueil" element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route element={<SidemenuLayout />}>
          <Route path="synthese" element={<Overview />} />
          <Route path="positionnement" element={<Positioning />} />
          <Route path="collaborations" element={<div>Collaborations</div>} />
          <Route path="beneficiaires" element={<Beneficiaries />} />
        </Route>

        <Route path="/msca" element={<div>MSCA</div>} />
        <Route path="/erc" element={<div>ERC</div>} />

        {/* <Route index element={<Navigate to="synthese" replace />} /> */}
        {/* <Route path="synthese" element={<Overview />} /> */}
        <Route path="evolution" element={<div>Evolution</div>} />
        <Route path="objectifs-types-projets" element={<ProjectsTypes />} />
        <Route path="programme-mires" element={<div>Programme MIRES</div>} />
        <Route path="appel-a-projets" element={<div>Appel à projets</div>} />
        <Route
          path="donnees-reference"
          element={<div>Données de référence</div>}
        />
        <Route path="informations" element={<Informations />} />
      </Route>
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";

import Main from "./index.tsx";
import AnalysisHomepage from "./components/pages/general/index.tsx";
import Beneficiaries from "./components/pages/general/beneficiaries/index.tsx";
import Overview from "./components/pages/general/overview/index.tsx";
import Positioning from "./components/pages/general/positioning/index.tsx";
import ProjectsTypes from "./components/pages/general/projects-types/index.tsx";
import { Layout } from "../../layout/Layout.tsx";

export default function EuropeanProjectsRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />}>
          <Route path="/general" element={<AnalysisHomepage />}>
            <Route path="synthese" element={<Overview />} />
            <Route path="positionnement" element={<Positioning />} />
            <Route path="evolution" element={<div>Evolution</div>} />
            <Route path="objectifs-types-projets" element={<ProjectsTypes />} />
            <Route path="beneficiaires" element={<Beneficiaries />} />
            <Route
              path="programme-mires"
              element={<div>Programme MIRES</div>}
            />
            <Route
              path="appel-a-projets"
              element={<div>Appel à projets</div>}
            />
            <Route
              path="donnees-reference"
              element={<div>Données de référence</div>}
            />
            <Route path="informations" element={<div>Informations</div>} />
          </Route>
          <Route
            path="/horizon-europe"
            element={<div>HE hors ERC & MSCA</div>}
          />
          <Route path="/msca" element={<div>MSCA</div>} />
          <Route path="/erc" element={<div>ERC</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

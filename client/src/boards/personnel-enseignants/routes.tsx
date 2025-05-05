import { Routes, Route } from "react-router-dom";

import GlobalLayout from "./components/layouts/global-layout.tsx";
import SidemenuLayout from "./components/layouts/sidemenu-layout.tsx";

import Disciplines from "./pages/disciplines/index.tsx";
import Evolution from "./pages/evolution/index.tsx";
import Home from "./pages/home/index.tsx";
import Overview from "./pages/overview/index.tsx";
import Search from "./pages/search/index.tsx";
import Typology from "./pages/topology/index.tsx";

export default function EuropeanProjectsRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout languageSelector={false} />}>
        <Route path="/" element={<Home />} />
        <Route path="accueil" element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route element={<SidemenuLayout />}>
          <Route path="synthese" element={<Overview />} />
          <Route path="disciplines" element={<Disciplines />} />
          <Route path="typologie" element={<Typology />} />
          <Route path="evolution" element={<Evolution />} />
        </Route>
      </Route>
    </Routes>
  );
}

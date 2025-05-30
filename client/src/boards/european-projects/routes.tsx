import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";

import Beneficiaries from "./pages/beneficiaries/index.tsx";
import Collaborations from "./pages/collaborations/index.tsx";
import Overview from "./pages/overview/index.tsx";
import Positioning from "./pages/positioning/index.tsx";
import ProjectsTypes from "./pages/projects-types/index.tsx";

import Informations from "./pages/informations.tsx";
import GlobalLayout from "./components/layouts/global-layout.tsx";
import Home from "./pages/home/index.tsx";
import Search from "./pages/search/index.tsx";
import SidemenuLayout from "./components/layouts/sidemenu-layout.tsx";

import "./styles.scss";
import { useTitle } from "../../hooks/usePageTitle.tsx";

import i18n from "./title-i18n.json";

const useRouteTitle = (path: string) => {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  useTitle(getI18nLabel(path));
};

const RouteWithTitle = ({ titleKey, element }) => {
  useRouteTitle(titleKey);
  return element;
};

export default function EuropeanProjectsRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout languageSelector />}>
        <Route index element={<Navigate to="accueil" replace />} />
        <Route path="accueil" element={<RouteWithTitle titleKey="accueil" element={<Home />} />} />
        <Route path="search" element={<RouteWithTitle titleKey="search" element={<Search />} />} />
        <Route element={<SidemenuLayout />}>
          <Route path="synthese" element={<RouteWithTitle titleKey="synthese" element={<Overview />} />} />
          <Route path="positionnement" element={<RouteWithTitle titleKey="positionnement" element={<Positioning />} />} />
          <Route path="collaborations" element={<RouteWithTitle titleKey="collaborations" element={<Collaborations />} />} />
          <Route path="beneficiaires" element={<RouteWithTitle titleKey="beneficiaires" element={<Beneficiaries />} />} />
          <Route path="beneficiaires-types" element={<RouteWithTitle titleKey="beneficiaires-types" element={<div>Types de bénéficiaires</div>} />} />
        </Route>
        <Route path="msca" element={<RouteWithTitle titleKey="msca" element={<div>MSCA</div>} />} />
        <Route path="erc" element={<RouteWithTitle titleKey="erc" element={<div>ERC</div>} />} />
        <Route path="evolution" element={<RouteWithTitle titleKey="evolution" element={<div>Evolution</div>} />} />
        <Route path="objectifs-types-projets" element={<RouteWithTitle titleKey="objectifs-types-projets" element={<ProjectsTypes />} />} />
        <Route path="programme-mires" element={<RouteWithTitle titleKey="programme-mires" element={<div>Programme MIRES</div>} />} />
        <Route path="appel-a-projets" element={<RouteWithTitle titleKey="appel-a-projets" element={<div>Appel à projets</div>} />} />
        <Route path="donnees-reference" element={<RouteWithTitle titleKey="donnees-reference" element={<div>Données de référence</div>} />} />
        <Route path="informations" element={<RouteWithTitle titleKey="informations" element={<Informations />} />} />
      </Route>
    </Routes>
  );
}

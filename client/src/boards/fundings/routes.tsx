import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";

import { useTitle } from "../../hooks/usePageTitle.tsx";
import GlobalLayout from "./components/layouts/global-layout.tsx";
import Counties from "./pages/counties";
import Home from "./pages/home";
import SidemenuLaboratories from "./pages/laboratories/components/sidemenu";
import Laboratories from "./pages/laboratories/index.tsx";
import National from "./pages/national";
import SidemenuCounties from "./pages/counties/components/sidemenu";
import SidemenuNational from "./pages/national/components/sidemenu";
import SidemenuStructures from "./pages/structures/components/sidemenu";
import Structures from "./pages/structures/index.tsx";
import i18n from "./title-i18n.json";

import "./styles.scss";

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


export default function FundingsRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout languageSelector />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<RouteWithTitle titleKey="home" element={<Home />} />} />
        <Route element={<SidemenuNational />}>
          <Route path="national" element={<RouteWithTitle titleKey="national" element={<National />} />} />
        </Route>
        <Route element={<SidemenuStructures />}>
          <Route path="structures" element={<RouteWithTitle titleKey="structures" element={<Structures />} />} />
        </Route>
        <Route element={<SidemenuLaboratories />}>
          <Route path="laboratories" element={<RouteWithTitle titleKey="laboratories" element={<Laboratories />} />} />
        </Route>
        <Route element={<SidemenuCounties />}>
          <Route path="counties" element={<RouteWithTitle titleKey="counties" element={<Counties />} />} />
        </Route>
      </Route>
    </Routes>
  );
}

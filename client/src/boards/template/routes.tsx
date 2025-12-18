import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";

import GlobalLayout from "./components/layouts/global-layout.tsx";
import Home from "./pages/home/index.tsx";
import SidemenuLayout from "./components/layouts/sidemenu-layout.tsx";

import "./styles.scss";
import { useTitle } from "../../hooks/usePageTitle.tsx";

import i18n from "./title-i18n.json";
import Overview from "./pages/overview/index.tsx";

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

export default function TemplateRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout languageSelector />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<RouteWithTitle titleKey="home" element={<Home />} />} />
        <Route element={<SidemenuLayout />}>
          <Route path="overview" element={<RouteWithTitle titleKey="overview" element={<Overview />} />} />
        </Route>
      </Route>
    </Routes>
  );
}

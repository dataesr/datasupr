import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./index.tsx";
// import { Layout } from "../../layout/layout.tsx";
import { useTitle } from "../../hooks/usePageTitle.tsx";
import { getI18nLabel } from "../../utils";
import GlobalLayout from "./components/layouts/global-layout.tsx";
import Countries from "./pages/countries/index.tsx";
import Entities from "./pages/entities/index.tsx";
import i18n from "./title-i18n.json";


const RouteWithTitle = ({ titleKey, element }) => {
  useTitle(getI18nLabel(i18n, titleKey))
  return element;
};

export default function TedsRoutes() {
  return (
    // <Routes>
    //   <Route element={<Layout languageSelector />}>
    //     <Route path="/" element={<Home />} />
    //   </Route>
    // </Routes>

    <Routes>
      <Route element={<GlobalLayout languageSelector />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<RouteWithTitle titleKey="home" element={<Home />} />} />
        <Route path="countries" element={<RouteWithTitle titleKey="countries" element={<Countries />} />} />
        <Route path="entities" element={<RouteWithTitle titleKey="entities" element={<Entities />} />} />
      </Route>
    </Routes>
  );
}

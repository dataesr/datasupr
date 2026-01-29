import { Navigate, Route, Routes } from "react-router-dom";

import NotFoundPage from "../../components/not-found-page.tsx";
import { useTitle } from "../../hooks/usePageTitle.tsx";
import { getI18nLabel } from "../../utils";
import GlobalLayout from "./components/layouts/global-layout.tsx";
import Comparison from "./pages/comparison/index.tsx";
import Home from "./pages/home/index.tsx";
import Structures from "./pages/structures/index.tsx";
import i18n from "./title-i18n.json";

import "./styles.scss";

const RouteWithTitle = ({ titleKey, element }) => {
  useTitle(getI18nLabel(i18n, titleKey))
  return element;
};


export default function FundingsRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route index element={<Navigate to="accueil" replace />} />
        <Route path="" element={<Navigate to="accueil" replace />} />
        <Route path="accueil" element={<RouteWithTitle titleKey="accueil" element={<Home />} />} />
        <Route path="comparaison" element={<RouteWithTitle titleKey="comparaison" element={<Comparison />} />} />
        <Route path="etablissement" element={<RouteWithTitle titleKey="etablissement" element={<Structures />} />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

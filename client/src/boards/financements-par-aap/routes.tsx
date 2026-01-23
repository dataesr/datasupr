import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";

import NotFoundPage from "../../components/not-found-page.tsx";
import { useTitle } from "../../hooks/usePageTitle.tsx";
import GlobalLayout from "./components/layouts/global-layout.tsx";
import Comparison from "./pages/comparison/index.tsx";
import Home from "./pages/home/index.tsx";
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
      <Route element={<GlobalLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route path="/home" element={<RouteWithTitle titleKey="home" element={<Home />} />} />
        <Route path="/structures" element={<RouteWithTitle titleKey="structures" element={<Structures />} />} />
        <Route path="/comparison" element={<RouteWithTitle titleKey="comparison" element={<Comparison />} />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

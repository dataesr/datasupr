import { Route, Routes } from "react-router-dom";

import NotFoundPage from "../../components/not-found-page.tsx";
import { useTitle } from "../../hooks/usePageTitle.tsx";
import { getI18nLabel } from "../../utils.tsx";
import i18n from "./title-i18n.json";

import "./styles.scss";
import GlobalLayout from "./components/layouts/global-layout.tsx";
import Home from "./pages/home/index.tsx";
import DataView from "./pages/structures/index.tsx";
import DefinitionsPage from "./pages/definitions/index.tsx";

const RouteWithTitle = ({ titleKey, element }) => {
  useTitle(getI18nLabel(i18n, titleKey));
  return element;
};


export default function FacultyMembersRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route
          path="accueil"
          element={
            <RouteWithTitle
              titleKey="Accueil - Le personnel enseignant de l'enseignement supérieur français"
              element={<Home />}
            />
          }
        />
        <Route
          path="etablissements"
          element={
            <RouteWithTitle
              titleKey="Établissements - Personnel enseignant"
              element={<DataView viewType="structure" />}
            />
          }
        />
        <Route
          path="disciplines"
          element={
            <RouteWithTitle
              titleKey="Disciplines - Personnel enseignant"
              element={<DataView viewType="discipline" />}
            />
          }
        />
        <Route
          path="regions"
          element={
            <RouteWithTitle
              titleKey="Régions - Personnel enseignant"
              element={<DataView viewType="region" />}
            />
          }
        />
        <Route
          path="academies"
          element={
            <RouteWithTitle
              titleKey="Académies - Personnel enseignant"
              element={<DataView viewType="academie" />}
            />
          }
        />
        <Route
          path="definitions"
          element={
            <RouteWithTitle
              titleKey="Définitions - Personnel enseignant"
              element={<DefinitionsPage />}
            />
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

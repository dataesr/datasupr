import { Navigate, Route, Routes } from "react-router-dom";

import NotFoundPage from "../../components/not-found-page.tsx";
import GlobalLayout from "./components/layouts/global-layout.tsx";
import AccueilView from "./pages/accueil/index.tsx";
import DefinitionsView from "./pages/definitions/index.tsx";
import FAQView from "./pages/faq/index.tsx";
import NationalView from "./pages/national/index.tsx";
import StructuresView from "./pages/structures/index.tsx";

import "./styles.scss";


export default function StructuresFinanceRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route
          index
          element={
            <Navigate
              to="etablissements?year=2024&type=tous&region=toutes&structureId="
              replace
            />
          }
        />
        <Route path="accueil" element={<AccueilView />} />
        <Route path="definitions" element={<DefinitionsView />} />
        <Route path="etablissements" element={<StructuresView />} />
        <Route path="faq" element={<FAQView />} />
        <Route path="national" element={<NationalView />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

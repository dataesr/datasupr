import { Routes, Route, Navigate } from "react-router-dom";
import FinanceUniversityLayout from "./index.tsx";
// import AccueilView from "./pages/accueil/index.tsx";
import NationalView from "./pages/national/index.tsx";
import StructuresView from "./pages/structures/index.tsx";

import "./styles.scss";
import GlobalLayout from "./components/layouts/global-layout.tsx";

// Page d'accueil ou non ? Voir avec yann &/ou Emmanuel

export default function StructuresFinanceRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route element={<FinanceUniversityLayout />}>
          <Route
            index
            element={
              <Navigate
                to="etablissements?year=2024&type=tous&region=toutes&structureId="
                replace
              />
            }
          />
          <Route path="national" element={<NationalView />} />
          <Route path="etablissements" element={<StructuresView />} />
        </Route>
      </Route>
    </Routes>
  );
}

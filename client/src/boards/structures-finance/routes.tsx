import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../../layout/layout.tsx";
import FinanceUniversityLayout from "./index.tsx";
import AccueilView from "./pages/accueil/index.tsx";
import NationalView from "./pages/national/index.tsx";
import StructuresView from "./pages/structures/index.tsx";
// import EvolutionsView from "./pages/evolutions/index.tsx";

import "./styles.scss";

export default function StructuresFinanceRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<FinanceUniversityLayout />}>
          <Route index element={<Navigate to="accueil" replace />} />
          <Route path="accueil" element={<AccueilView />} />
          <Route path="national" element={<NationalView />} />
          <Route path="etablissements" element={<StructuresView />} />
          {/* <Route path="evolutions" element={<EvolutionsView />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

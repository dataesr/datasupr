import { Routes, Route } from "react-router-dom";

import Main from "./index.tsx";
import { Layout } from "../../layout/layout.tsx";
import AccueilView from "./page/accueil/index.tsx";
import NationalView from "./page/national/index.tsx";
import StructuresView from "./page/structures/index.tsx";
import EvolutionsView from "./page/evolutions/index.tsx";

export default function FinanceUniversityRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />}>
          <Route path="/accueil" element={<AccueilView />} />
          <Route path="/vue-nationale" element={<NationalView />} />
          <Route path="/etablissements" element={<StructuresView />} />
          <Route path="/evolutions" element={<EvolutionsView />} />
        </Route>
      </Route>
    </Routes>
  );
}

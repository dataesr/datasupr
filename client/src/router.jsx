import { Route, Routes } from "react-router-dom";

import Layout from "./layout";
import Home from "./pages/home";
import Search from "./pages/search";
import Tableaux from "./pages/tableaux";
import EvolutionFundingSigned from "./pages/tableaux/EvolutionFundingSigned";
import Financial from "./pages/tableaux/financial";
import Swagger from "./pages/swagger";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/search" element={<Search />} />

        <Route path="/tableaux" element={<Tableaux />} />
        <Route
          path="/tableaux/evolution-funding-signed"
          element={<EvolutionFundingSigned />}
        />
        <Route
          path="/tableaux/tableau-de-bord-financier"
          element={<Financial />}
        />

        <Route path="/swagger" element={<Swagger />} />
      </Route>
    </Routes>
  );
}

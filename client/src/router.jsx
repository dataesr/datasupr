import { Route, Routes } from "react-router-dom";

import Layout from "./layout";
import Home from "./pages/home";
import Search from "./pages/search";
import Tableaux from "./pages/tableaux";
import Financial from "./pages/tableaux/financial";
import Swagger from "./pages/swagger";
import EuropeanProjects from "./pages/tableaux/europrojects";
import ERC from "./pages/tableaux/ERC";
import MSCA from "./pages/tableaux/MSCA";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tableaux" element={<Tableaux />} />
        <Route
          path="/tableaux/european-projects"
          element={<EuropeanProjects />}
        />
        <Route path="/tableaux/erc" element={<ERC />} />
        <Route path="/tableaux/msca" element={<MSCA />} />
        <Route
          path="/tableaux/tableau-de-bord-financier"
          element={<Financial />}
        />
        <Route path="/swagger" element={<Swagger />} />
      </Route>
    </Routes>
  );
}

import { Route, Routes } from "react-router-dom";

import Atlas from "./pages/tableaux/atlas";
import ERC from "./pages/tableaux/ERC";
import EuropeanProjects from "./pages/tableaux/europrojects";
import Financial from "./pages/tableaux/financial";
import Home from "./pages/home";
import Layout from "./layout";
import MSCA from "./pages/tableaux/MSCA";
import Search from "./pages/search";
import Swagger from "./pages/swagger";
import Tableaux from "./pages/tableaux";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/swagger" element={<Swagger />} />
        <Route path="/tableaux" element={<Tableaux />} />
        <Route path="/tableaux/atlas" element={<Atlas />} />
        <Route path="/tableaux/erc" element={<ERC />} />
        <Route path="/tableaux/european-projects" element={<EuropeanProjects />} />
        <Route path="/tableaux/msca" element={<MSCA />} />
        <Route path="/tableaux/tableau-de-bord-financier" element={<Financial />} />
      </Route>
    </Routes>
  );
}

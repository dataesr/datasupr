import { Route, Routes } from "react-router-dom";

import Home from "./index.tsx";
import { Layout } from "../../layout/layout.tsx";

export default function GraduatesRoutes() {
  return (
    <Routes>
      <Route element={<Layout languageSelector />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

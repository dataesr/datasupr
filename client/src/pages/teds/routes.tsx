import { Route, Routes } from "react-router-dom";

import Home from "./index.tsx";
import { Layout } from "../../layout/Layout.tsx";

export default function TedsRoutes() {
  return (
    <Routes>
      <Route element={<Layout languageSelector />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

import { Route, Routes } from "react-router-dom";

import Home from "./index.tsx";
import { Layout } from "../../layout/Layout.tsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

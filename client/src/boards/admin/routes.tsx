import { Route, Routes } from "react-router-dom";

import Home from "./home.tsx";
import { Layout } from "../../layout/layout.tsx";
import Dashboard from "./dashboard.tsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/:dashboardId" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

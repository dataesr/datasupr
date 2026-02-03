import { Route, Routes } from "react-router-dom";

import NotFoundPage from "../../components/not-found-page.tsx";
import { Layout } from "../../layout/layout.tsx";
import Home from "./index.tsx";


export default function GraduatesRoutes() {
  return (
    <Routes>
      <Route element={<Layout languageSelector />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

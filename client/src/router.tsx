import { Route, Routes } from 'react-router-dom';

import HomePage from './pages/home-page.tsx';
import { Layout } from './layout/Layout.tsx';
import AtlasRoutes from './pages/atlas/routes.tsx';
import EuropeanProjectsRoutes from './pages/european-projects/routes.tsx';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<Layout />}>
        <Route path="/atlas/*" element={<AtlasRoutes />} />
        <Route path="/open-alex/*" element={<div>Open Alex tab</div>} />
        <Route path="/european-projects/*" element={<EuropeanProjectsRoutes />} />
      </Route>
      <Route path="*" element={<div>404 atlas</div>} />
    </Routes>
  );
}

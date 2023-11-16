import { Route, Routes } from 'react-router-dom';

import { Layout } from './layout/Layout';
import { AtlasSideMenu } from './pages/atlas/side-menu-layout/index';
import { Home as AtlasHome } from './pages/atlas/home';

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/atlas" element={<AtlasSideMenu />}>
          <Route path="en-un-coup-d-oeil" element={<AtlasHome />} />
        </Route>
      </Route>
    </Routes>
  );
}
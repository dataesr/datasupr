import { Route, Routes } from 'react-router-dom';

import { Layout } from './layout/Layout.tsx';
// import { AtlasSideMenu } from './pages/atlas/side-menu-layout/index';
import { General } from './pages/atlas/components/main/tabs/general.tsx';
import { FieldsRouter } from './pages/atlas/components/main/tabs/fields/index.tsx';
import { Sectors } from './pages/atlas/components/main/tabs/sectors.tsx';
import { Genders } from './pages/atlas/components/main/tabs/genders.tsx';
import { OtherGeographicalLevels } from './pages/atlas/components/main/tabs/other-geographical-levels.tsx';

import HomePage from './pages/home-page.tsx';
import AtlasHeader from './pages/atlas/components/main/index.tsx';

function NoMatch() {
  return (
    <div>404</div>
  );
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<Layout />}>
        <Route path="/atlas" element={<AtlasHeader />}>
          <Route path="general" element={<General />} />
          <Route path="effectifs-par-filiere/:idFiliere?" element={<FieldsRouter />} />
          <Route path="effectifs-par-secteurs" element={<Sectors />} />
          <Route path="effectifs-par-genre" element={<Genders />} />
          <Route path="autres-niveaux-geographiques" element={<OtherGeographicalLevels />} />
        </Route>
        <Route path="/open-alex" element={<div>Open Alex tab</div>} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}
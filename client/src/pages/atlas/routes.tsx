import { Routes, Route } from 'react-router-dom';

import AtlasHeader from './index.tsx';
import { General } from './components/main/tabs/general.tsx';
import { FieldsRouter } from './components/main/tabs/fields/index.tsx';
import { Sectors } from './components/main/tabs/sectors.tsx';
import { Genders } from './components/main/tabs/genders.tsx';
import { OtherGeographicalLevels } from './components/main/tabs/other-geographical-levels.tsx';
import { Layout } from './components/layout/layout.tsx';

export default function AtlasRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<AtlasHeader />}>
          <Route path="general" element={<General />} />
          <Route path="effectifs-par-filiere/:idFiliere?" element={<FieldsRouter />} />
          <Route path="effectifs-par-secteurs" element={<Sectors />} />
          <Route path="effectifs-par-genre" element={<Genders />} />
          <Route path="autres-niveaux-geographiques" element={<OtherGeographicalLevels />} />
        </Route>
      </Route>
    </Routes>
  );
}
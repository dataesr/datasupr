import { Routes, Route } from 'react-router-dom';

import Main from './index.tsx';
import AnalysisHomepage from './components/pages/general/index.tsx';
import Overview from './components/pages/general/overview/index.tsx';
import Positioning from './components/pages/general/positioning/index.tsx';
import { Layout } from '../../layout/Layout.tsx';

export default function EuropeanProjectsRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />}>
          <Route path="/general" element={<AnalysisHomepage />}>
            <Route path="synthese" element={<Overview />} />
            <Route path="positionnement" element={<Positioning />} />
            <Route path="collaboration" element={<div>Collaboration</div>} />
            <Route path="evolution" element={<div>Evolution</div>} />
            <Route path="appel-a-projets" element={<div>Appel à projets</div>} />
            <Route path="beneficiaires" element={<div>Bénéficiaires</div>} />
          </Route>
          <Route path="/projets-collaboratifs" element={<div>Projets collaboratifs</div>} />
          <Route path="/msca" element={<div>MSCA</div>} />
          <Route path="/erc" element={<div>ERC</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

import { Routes, Route } from 'react-router-dom';

import Main from './index.tsx';
import AnalysisHomepage from './components/pages/analysis/index.tsx';
import Overview from './components/pages/analysis/overview/index.tsx';

export default function EuropeanProjectsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route path="/analyse" element={<AnalysisHomepage />}>
          <Route path="synthese" element={<Overview />} />
          <Route path="positionnement" element={<div>Positionnement</div>} />
          <Route path="collaboration" element={<div>Collaboration</div>} />
          <Route path="evolution" element={<div>Evolution</div>} />
          <Route path="appel-a-projets" element={<div>Appel à projets</div>} />
          <Route path="beneficiaires" element={<div>Bénéficiaires</div>} />
          <Route path="erc" element={<div>ERC</div>} />
          <Route path="msca" element={<div>MSCA</div>} />
        </Route>
        <Route path="/liste-des-appels-a-projets" element={<div>Liste des appels à projets</div>} />
        <Route path="/chiffres-cles-tableau" element={<div>Chiffres-clés tableau</div>} />
        <Route path="/objectifs" element={<div>Objectifs</div>} />
        <Route path="/collaborations-chiffrees" element={<div>Collaborations chiffrées</div>} />
        <Route path="/pays" element={<div>Pays</div>} />
        <Route path="/pays-evolution" element={<div>Pays évolution</div>} />
        <Route path="/typologie-des-participants" element={<div>Typologie des participants</div>} />
        <Route path="/participants-francais" element={<div>Participants français</div>} />
        <Route path="/participants-tous-pays" element={<div>Participants tous pays</div>} />
        <Route path="/participants-hors-pays" element={<div>Participants hors pays</div>} />
      </Route>
    </Routes>
  );
}
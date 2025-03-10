import { Routes, Route } from 'react-router-dom';

import Main from './index.tsx';
import { Layout } from "../../layout/layout.tsx";

export default function FinanceUniversityRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />}>
          <Route path="/grands-indicateurs" element={<div>Les grands indicateurs</div>} />
          <Route path="/recettes-propres" element={<div>Les recettes propres</div>} />
          <Route path="/masse-salariale" element={<div>La masse salariale</div>} />
          <Route path="/consommation" element={<div>La consommation</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

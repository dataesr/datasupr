import { Routes, Route } from 'react-router-dom';

import Main from './index.tsx';

export default function EuropeanProjectsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
}
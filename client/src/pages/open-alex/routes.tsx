import { Routes, Route } from 'react-router-dom';

import Welcome from './index.tsx';

export default function AtlasRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
    </Routes>
  );
}
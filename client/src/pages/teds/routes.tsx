import { Routes, Route } from 'react-router-dom';

import Welcome from './index.tsx';

export default function TedsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
    </Routes>
  );
}
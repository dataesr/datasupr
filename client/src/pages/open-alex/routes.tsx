import { Route, Routes } from 'react-router-dom';

import Home from './index.tsx';

export default function OpenAlexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
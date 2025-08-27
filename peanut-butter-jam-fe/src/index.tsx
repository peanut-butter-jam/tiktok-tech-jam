import '@lynx-js/react/debug';
import { root } from '@lynx-js/react';

import { MemoryRouter, Route, Routes } from 'react-router';
import { Home } from './pages/home.js';
import { Regulations } from './pages/regulations.js';

root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/regulations" element={<Regulations />} />
      <Route path="/features" element={<view></view>} />
    </Routes>
  </MemoryRouter>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}

import { MemoryRouter, Route, Routes } from 'react-router';

import './App.css';

export function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<view></view>} />
        <Route path="/regulations" element={<view></view>} />
        <Route path="/features" element={<view></view>} />
      </Routes>
    </MemoryRouter>
  );
}

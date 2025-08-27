import type React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/main-page";
import RegulationsPage from "./pages/regulations-page";
import RegulationView from "./pages/regulation-view-page";
import { ThemeProvider } from "./contexts/theme/theme-provider";
import { Toaster } from "./shared/ui/sonner";

const App: React.FC = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/regulations" element={<RegulationsPage />} />
      <Route path="/regulations/:id" element={<RegulationView />} />
    </Routes>
    <Toaster richColors />
  </ThemeProvider>
);

export default App;

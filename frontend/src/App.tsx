import type React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/main-page";
import { ThemeProvider } from "./contexts/theme/theme-provider";
import { Toaster } from "./shared/ui/sonner";

const App: React.FC = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
    <Toaster richColors />
  </ThemeProvider>
);

export default App;

import type React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/main-page";
import { ThemeProvider } from "./contexts/theme/theme-provider";
import { Toaster } from "./shared/ui/sonner";
import { AuthProvider } from "./contexts/auth/auth-provider";
import { LoginPage, ProtectedRoute, SignUpPage } from "./pages/auth";

const App: React.FC = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* All routes below here require auth */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
        </Route>
      </Routes>
      <Toaster richColors />
    </AuthProvider>
  </ThemeProvider>
);

export default App;

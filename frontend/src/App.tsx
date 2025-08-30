import type React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/main-page";
import RegulationsPage from "./pages/regulations-page";
import RegulationView from "./pages/regulation-view-page";
import { ThemeProvider } from "./contexts/theme/theme-provider";
import { Toaster } from "./shared/ui/sonner";
import RegulationUpload from "./pages/regulation-upload";
import { Chatbot } from "./components/chatbot";
import { useChatbot } from "./hooks/use-chatbot";
import FeaturesPage from "./pages/feature";
import TerminologyPage from "./pages/terminology";

const App: React.FC = () => {
    const { sendMessage } = useChatbot();

    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/regulations" element={<RegulationsPage />} />
                <Route path="/regulations/:id" element={<RegulationView />} />
                <Route
                    path="/regulations/upload"
                    element={<RegulationUpload />}
                />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/terminologies" element={<TerminologyPage />} />
            </Routes>
            <Toaster richColors />
            <Chatbot onSendMessage={sendMessage} />
        </ThemeProvider>
    );
};

export default App;

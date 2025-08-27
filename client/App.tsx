import "./global.css";
import React from "react";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TourProvider } from "./contexts/TourContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { ToastContainer } from "react-toastify";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import BuildVAIS from "./pages/BuildVAIS";
import VAISResults from "./pages/VAISResults";
import ABMLAL from "./pages/ABMLAL";
import FindProspect from "./pages/FindProspect";
import ProspectResults from "./pages/ProspectResults";
import BuildCampaign from "./pages/BuildCampaign";
import BuildMyCampaign from "./pages/BuildMyCampaign";
import CampaignOverview from "./pages/CampaignOverview";
import MyDownloadedList from "./pages/MyDownloadedList";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Support from "./pages/Support";
import ChatSupport from "./pages/ChatSupport";
import FAQs from "./pages/FAQs";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <TourProvider>
              <Toaster />
              <Sonner />
              <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/build-vais" element={<BuildVAIS />} />
                  <Route path="/vais-results" element={<VAISResults />} />
                  <Route path="/abm-lal" element={<ABMLAL />} />
                  <Route path="/find-prospect" element={<FindProspect />} />
                  <Route
                    path="/prospect-results"
                    element={<ProspectResults />}
                  />
                  <Route path="/build-campaign" element={<BuildCampaign />} />
                  <Route
                    path="/build-my-campaign"
                    element={<BuildMyCampaign />}
                  />
                  <Route
                    path="/campaign-overview/:id"
                    element={<CampaignOverview />}
                  />
                  <Route path="/my-downloads" element={<MyDownloadedList />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/manage-users" element={<Users />} />
                  <Route path="/support" element={<Support />} />
                  <Route
                    path="/chat-support/:ticketId"
                    element={<ChatSupport />}
                  />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TourProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);

// Handle HMR properly to avoid multiple createRoot calls
const container = document.getElementById("root")!;

// Check if we're in development and already have a root
let root: any;
if (import.meta.hot) {
  // Store root in hot module data to persist across reloads
  const hotData = import.meta.hot.data;
  if (hotData.root) {
    root = hotData.root;
  } else {
    root = createRoot(container);
    hotData.root = root;
  }
} else {
  // Production: create root normally
  root = createRoot(container);
}

root.render(<App />);

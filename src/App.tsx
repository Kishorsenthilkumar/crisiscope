
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import IndiaMap from "./pages/IndiaMap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/dashboard"
            element={
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto">
                    <Dashboard />
                  </main>
                </div>
              </div>
            }
          />
          <Route
            path="/india-map"
            element={
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto">
                    <IndiaMap />
                  </main>
                </div>
              </div>
            }
          />
          <Route
            path="/reports"
            element={
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Reports & Data Export</h1>
                      <p className="text-muted-foreground">This page is under development.</p>
                    </div>
                  </main>
                </div>
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">User Settings & Customization</h1>
                      <p className="text-muted-foreground">This page is under development.</p>
                    </div>
                  </main>
                </div>
              </div>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

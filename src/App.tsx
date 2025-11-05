import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Wellthy from "./pages/Wellthy";
import HomeCare from "./pages/HomeCare";
import PTAdherence from "./pages/PTAdherence";
import PostSurgicalCare from "./pages/PostSurgicalCare";
import InjuryManagement from "./pages/InjuryManagement";
import MedicalSpend from "./pages/MedicalSpend";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employee-wellness" element={<Wellthy />} />
          <Route path="/home-care" element={<HomeCare />} />
          <Route path="/pt-adherence" element={<PTAdherence />} />
          <Route path="/post-surgical-care" element={<PostSurgicalCare />} />
          <Route path="/injury-management" element={<InjuryManagement />} />
          <Route path="/medical-spend" element={<MedicalSpend />} />
          <Route path="/team" element={<Team />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

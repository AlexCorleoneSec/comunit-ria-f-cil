import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import PvsLayout from "@/components/PvsLayout";
import Login from "@/pages/Login";
import TermoConfidencialidade from "@/pages/TermoConfidencialidade";
import MainMenu from "@/pages/MainMenu";
import Atendimentos from "@/pages/Atendimentos";
import Perfil from "@/pages/Perfil";
import Estatisticas from "@/pages/Estatisticas";
import PvsIndex from "@/pages/PvsIndex";
import PvsCadastro from "@/pages/PvsCadastro";
import PvsEstatisticas from "@/pages/PvsEstatisticas";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function RequireTermo({ children }: { children: React.ReactNode }) {
  const termoAceito = localStorage.getItem("termo_aceito") === "true";
  if (!termoAceito) return <Navigate to="/termo" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/termo" replace />} />
      <Route path="/termo" element={<TermoConfidencialidade />} />
      <Route path="/menu" element={<RequireTermo><MainMenu /></RequireTermo>} />

      {/* Mediação Comunitária */}
      <Route element={<RequireTermo><AppLayout><Routes><Route path="*" element={null} /></Routes></AppLayout></RequireTermo>}>
      </Route>
      <Route path="/mediacao" element={<RequireTermo><AppLayout children={<Atendimentos />} /></RequireTermo>} />
      <Route path="/mediacao/perfil" element={<RequireTermo><AppLayout children={<Perfil />} /></RequireTermo>} />
      <Route path="/mediacao/estatisticas" element={<RequireTermo><AppLayout children={<Estatisticas />} /></RequireTermo>} />

      {/* PVS */}
      <Route path="/pvs" element={<RequireTermo><PvsLayout /></RequireTermo>}>
        <Route index element={<PvsIndex />} />
        <Route path="cadastrar" element={<PvsCadastro />} />
        <Route path="estatisticas" element={<PvsEstatisticas />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

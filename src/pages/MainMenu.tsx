import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, LogOut } from "lucide-react";

export default function MainMenu() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7" />
            <div>
              <h1 className="text-lg font-heading font-bold leading-tight">Sistema Órion</h1>
              <p className="text-xs opacity-80 hidden sm:block">PMESP — Tribunal de Justiça</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => signOut()}
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">
            Selecione a Ferramenta
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 hover:border-primary"
              onClick={() => navigate("/mediacao")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold">Mediação Comunitária</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Atendimentos, perfil do mediador e estatísticas
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 hover:border-primary"
              onClick={() => navigate("/pvs")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold">Vizinhança Solidária</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Programa PVS — cadastro e estatísticas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Users, Plus, BarChart3, LogOut, ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { to: "/pvs", label: "PVS", icon: Users },
  { to: "/pvs/cadastrar", label: "Cadastrar", icon: Plus },
  { to: "/pvs/estatisticas", label: "Estatísticas", icon: BarChart3 },
];

export default function PvsLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/menu" className="hover:opacity-80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-heading font-bold leading-tight">Vizinhança Solidária</h1>
              <p className="text-xs opacity-80 hidden sm:block">Programa PVS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.to ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => signOut()} title="Sair">
              <LogOut className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden border-t border-primary-foreground/20 pb-3">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  location.pathname === item.to ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
    </div>
  );
}

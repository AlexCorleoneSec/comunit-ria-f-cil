import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ClipboardList, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const COLORS = ["hsl(215, 60%, 22%)", "hsl(40, 70%, 50%)", "hsl(152, 60%, 40%)", "hsl(205, 80%, 50%)", "hsl(0, 72%, 51%)", "hsl(270, 50%, 50%)", "hsl(180, 50%, 40%)"];

export default function Estatisticas() {
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ grande_comando: "", batalhao: "", companhia: "", ano: new Date().getFullYear().toString() });

  useEffect(() => {
    supabase.from("atendimentos").select("*").order("data_fato").then(({ data }) => {
      setAtendimentos(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return atendimentos.filter(a => {
      if (filters.ano && !a.data_fato.startsWith(filters.ano)) return false;
      if (filters.grande_comando && a.grande_comando !== filters.grande_comando) return false;
      if (filters.batalhao && a.batalhao !== filters.batalhao) return false;
      if (filters.companhia && a.companhia !== filters.companhia) return false;
      return true;
    });
  }, [atendimentos, filters]);

  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(a => {
      const key = format(parseISO(a.data_fato), "yyyy-MM");
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        name: format(parseISO(month + "-01"), "MMM/yy", { locale: ptBR }),
        total: count,
      }));
  }, [filtered]);

  const demandaData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(a => {
      const key = a.demanda || "Não informado";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const uniqueValues = (field: string) => [...new Set(atendimentos.map(a => a[field]).filter(Boolean))];
  const anos = [...new Set(atendimentos.map(a => a.data_fato?.substring(0, 4)).filter(Boolean))].sort().reverse();

  const totalConcluidos = filtered.filter(a => a.status === "concluido").length;
  const totalEmAndamento = filtered.filter(a => a.status === "em_andamento").length;

  return (
    <div className="page-container animate-fade-in">
      <h2 className="text-2xl font-heading font-bold mb-6">Estatísticas</h2>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Ano</Label>
              <Select value={filters.ano} onValueChange={v => setFilters(p => ({ ...p, ano: v }))}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos</SelectItem>
                  {anos.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Grande Comando</Label>
              <Select value={filters.grande_comando} onValueChange={v => setFilters(p => ({ ...p, grande_comando: v }))}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos</SelectItem>
                  {uniqueValues("grande_comando").map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Batalhão</Label>
              <Select value={filters.batalhao} onValueChange={v => setFilters(p => ({ ...p, batalhao: v }))}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos</SelectItem>
                  {uniqueValues("batalhao").map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Cia PM</Label>
              <Select value={filters.companhia} onValueChange={v => setFilters(p => ({ ...p, companhia: v }))}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos</SelectItem>
                  {uniqueValues("companhia").map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total de Atendimentos", value: filtered.length, icon: ClipboardList, color: "text-primary" },
          { label: "Concluídos", value: totalConcluidos, icon: CheckCircle, color: "text-success" },
          { label: "Em Andamento", value: totalEmAndamento, icon: Clock, color: "text-warning" },
          { label: "Este Mês", value: filtered.filter(a => a.data_fato?.startsWith(format(new Date(), "yyyy-MM"))).length, icon: TrendingUp, color: "text-info" },
        ].map(kpi => (
          <div key={kpi.label} className="stat-card flex items-center gap-4">
            <kpi.icon className={`w-8 h-8 ${kpi.color} shrink-0`} />
            <div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Atendimentos por Período</CardTitle></CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(215, 60%, 22%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">Sem dados para exibir</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Atendimentos por Demanda</CardTitle></CardHeader>
          <CardContent>
            {demandaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={demandaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                    {demandaData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">Sem dados para exibir</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

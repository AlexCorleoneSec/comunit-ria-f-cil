import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, MapPin, Building2, TrendingUp } from "lucide-react";

const COLORS = ["hsl(215, 60%, 22%)", "hsl(40, 70%, 50%)", "hsl(152, 60%, 40%)", "hsl(205, 80%, 50%)", "hsl(0, 72%, 51%)"];

export default function PvsEstatisticas() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("pvs_cadastros").select("*").then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const byModalidade = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => {
      const key = d.modalidade || "Não informado";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [data]);

  const byCidade = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => {
      const key = d.cidade || "Não informada";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, total]) => ({ name, total }));
  }, [data]);

  const totalWithLocation = data.filter(d => d.latitude && d.longitude).length;

  if (loading) return <div className="page-container text-center py-12 text-muted-foreground">Carregando...</div>;

  return (
    <div className="page-container animate-fade-in">
      <h2 className="text-2xl font-heading font-bold mb-6">Estatísticas PVS</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total de PVS", value: data.length, icon: Users, color: "text-primary" },
          { label: "Com Localização", value: totalWithLocation, icon: MapPin, color: "text-success" },
          { label: "Cidades", value: new Set(data.map(d => d.cidade).filter(Boolean)).size, icon: Building2, color: "text-info" },
          { label: "Este Ano", value: data.filter(d => d.ano_inicio === new Date().getFullYear()).length, icon: TrendingUp, color: "text-warning" },
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
          <CardHeader><CardTitle className="text-base">PVS por Cidade (Top 10)</CardTitle></CardHeader>
          <CardContent>
            {byCidade.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byCidade}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(215, 60%, 22%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">Sem dados</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">PVS por Modalidade</CardTitle></CardHeader>
          <CardContent>
            {byModalidade.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={byModalidade} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                    {byModalidade.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">Sem dados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

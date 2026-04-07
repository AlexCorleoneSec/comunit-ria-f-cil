import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, Pencil, CalendarDays, List, ChevronLeft, ChevronRight } from "lucide-react";
import AtendimentoForm from "@/components/AtendimentoForm";
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Atendimentos() {
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("atendimentos")
      .select("*, primeiro_mediador:mediadores!atendimentos_primeiro_mediador_id_fkey(nome), segundo_mediador:mediadores!atendimentos_segundo_mediador_id_fkey(nome)")
      .order("data_fato", { ascending: false });
    setAtendimentos(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const getAtendimentosForDay = (day: Date) =>
    atendimentos.filter(a => isSameDay(new Date(a.data_fato), day));

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      em_andamento: "Em Andamento",
      concluido: "Concluído",
      cancelado: "Cancelado",
    };
    return map[status] || status;
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-heading font-bold">Atendimentos</h2>
        <Button size="lg" className="h-12 text-base gap-2" onClick={() => { setEditData(null); setFormOpen(true); }}>
          <Plus className="w-5 h-5" /> Adicionar Atendimento
        </Button>
      </div>

      <Tabs defaultValue="lista">
        <TabsList>
          <TabsTrigger value="lista" className="gap-2"><List className="w-4 h-4" /> Lista</TabsTrigger>
          <TabsTrigger value="calendario" className="gap-2"><CalendarDays className="w-4 h-4" /> Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-4">
          {loading ? (
            <p className="text-muted-foreground text-center py-12">Carregando...</p>
          ) : atendimentos.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum atendimento cadastrado.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {atendimentos.map(a => (
                <Card key={a.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{a.origem_atendimento}</span>
                        <Badge variant="secondary">{a.demanda || "—"}</Badge>
                        <Badge variant="outline">{statusBadge(a.status)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(a.data_fato), "dd/MM/yyyy")} — {a.endereco_ocorrencia || "Sem endereço"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewData(a)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditData(a); setFormOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendario" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium text-sm">
              {format(weekStart, "dd MMM", { locale: ptBR })} — {format(addDays(weekStart, 6), "dd MMM yyyy", { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {weekDays.map(day => {
              const dayItems = getAtendimentosForDay(day);
              const isToday = isSameDay(day, new Date());
              return (
                <div key={day.toISOString()} className={`border rounded-lg p-3 min-h-[120px] ${isToday ? "border-primary bg-primary/5" : ""}`}>
                  <p className={`text-xs font-semibold uppercase mb-2 ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                    {format(day, "EEE dd", { locale: ptBR })}
                  </p>
                  {dayItems.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setViewData(a)}
                      className="w-full text-left mb-1 p-1.5 rounded text-xs bg-accent/50 hover:bg-accent transition-colors truncate"
                    >
                      {a.origem_atendimento} — {a.demanda || "—"}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <AtendimentoForm open={formOpen} onClose={() => { setFormOpen(false); setEditData(null); }} onSaved={fetchData} editData={editData} />

      {/* View dialog */}
      <Dialog open={!!viewData} onOpenChange={v => !v && setViewData(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Atendimento</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="space-y-3 text-sm">
              {[
                ["Origem", viewData.origem_atendimento],
                ["Data do Fato", viewData.data_fato ? format(new Date(viewData.data_fato), "dd/MM/yyyy") : "—"],
                ["Data do Registro", viewData.data_registro ? format(new Date(viewData.data_registro), "dd/MM/yyyy") : "—"],
                ["Tipo de Local", viewData.tipo_local],
                ["Demanda", viewData.demanda],
                ["Endereço", viewData.endereco_ocorrencia],
                ["Status", statusBadge(viewData.status)],
                ["1º Mediador", viewData.primeiro_mediador?.nome],
                ["2º Mediador", viewData.segundo_mediador?.nome],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right max-w-[60%]">{(val as string) || "—"}</span>
                </div>
              ))}
              {viewData.resumo_fato && (
                <div>
                  <p className="text-muted-foreground mb-1">Resumo do Fato</p>
                  <p className="bg-muted p-3 rounded-md">{viewData.resumo_fato}</p>
                </div>
              )}
              {viewData.observacoes && (
                <div>
                  <p className="text-muted-foreground mb-1">Observações</p>
                  <p className="bg-muted p-3 rounded-md">{viewData.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, BarChart3, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PvsIndex() {
  const navigate = useNavigate();
  const [cadastros, setCadastros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState<any>(null);

  useEffect(() => {
    supabase.from("pvs_cadastros").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setCadastros(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-heading font-bold">Vizinhança Solidária (PVS)</h2>
        <div className="flex gap-2">
          <Button size="lg" className="h-12 text-base gap-2" onClick={() => navigate("/pvs/cadastrar")}>
            <Plus className="w-5 h-5" /> Cadastrar PVS
          </Button>
          <Button size="lg" variant="outline" className="h-12 text-base gap-2" onClick={() => navigate("/pvs/estatisticas")}>
            <BarChart3 className="w-5 h-5" /> Estatísticas
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Carregando...</p>
      ) : cadastros.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum PVS cadastrado ainda. Clique em "Cadastrar PVS" para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cadastros.map(c => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{c.nome_tutor}</span>
                    <Badge variant="secondary">{c.modalidade || "—"}</Badge>
                    <Badge variant="outline">{c.cidade || "—"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {c.opm || "—"} · {c.cia_pm || "—"} · Início: {c.ano_inicio || "—"}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setViewData(c)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!viewData} onOpenChange={v => !v && setViewData(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do PVS</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="space-y-3 text-sm">
              {[
                ["Tutor", viewData.nome_tutor],
                ["Documento", viewData.documento_tutor],
                ["Contato", viewData.contato_tutor],
                ["E-mail", viewData.email_tutor],
                ["OPM", viewData.opm],
                ["Cia PM", viewData.cia_pm],
                ["Modalidade", viewData.modalidade],
                ["Cidade", viewData.cidade],
                ["Ano de Início", viewData.ano_inicio],
                ["Endereço", viewData.endereco],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right max-w-[60%]">{(val as string) || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

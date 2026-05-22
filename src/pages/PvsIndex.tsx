import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart3, Eye, Pencil, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import PvsMapView from "@/components/PvsMapView";
import PvsMap from "@/components/PvsMap";

const MODALIDADES = ["Residencial", "Comercial", "Rural", "Escolar", "Mista"];

export default function PvsIndex() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cadastros, setCadastros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const loadCadastros = async () => {
    const { data } = await supabase.from("pvs_cadastros").select("*").order("created_at", { ascending: false });
    setCadastros(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCadastros();
  }, []);

  const openView = (c: any) => {
    setViewData(c);
    setEditMode(false);
    setEditForm(null);
  };

  const startEdit = () => {
    setEditForm({ ...viewData });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditForm(null);
  };

  const updateField = (field: string, value: any) => {
    setEditForm((p: any) => ({ ...p, [field]: value }));
  };

  const handleMapChange = (data: {
    center: [number, number];
    start: [number, number] | null;
    end: [number, number] | null;
  }) => {
    setEditForm((p: any) => ({
      ...p,
      latitude: data.center[0],
      longitude: data.center[1],
      ponto_inicial_lat: data.start?.[0] || 0,
      ponto_inicial_lng: data.start?.[1] || 0,
      ponto_final_lat: data.end?.[0] || 0,
      ponto_final_lng: data.end?.[1] || 0,
    }));
  };

  const saveEdit = async () => {
    if (!editForm?.nome_tutor) {
      toast({ title: "Preencha o nome do tutor", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { id, user_id, created_at, updated_at, ...payload } = editForm;
    const { error } = await supabase.from("pvs_cadastros").update(payload).eq("id", id);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "PVS atualizado com sucesso!" });
      await loadCadastros();
      setViewData({ ...editForm });
      setEditMode(false);
      setEditForm(null);
    }
    setSaving(false);
  };

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
                <Button size="sm" variant="outline" onClick={() => openView(c)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!viewData} onOpenChange={v => { if (!v) { setViewData(null); setEditMode(false); setEditForm(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              <span>{editMode ? "Editar PVS" : "Detalhes do PVS"}</span>
              {viewData && !editMode && (
                <Button size="sm" variant="outline" onClick={startEdit} className="gap-2 mr-8">
                  <Pencil className="w-4 h-4" /> Editar
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          {viewData && !editMode && (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Trajeto no mapa</h4>
                <PvsMapView
                  start={
                    viewData.ponto_inicial_lat && viewData.ponto_inicial_lng
                      ? [viewData.ponto_inicial_lat, viewData.ponto_inicial_lng]
                      : null
                  }
                  end={
                    viewData.ponto_final_lat && viewData.ponto_final_lng
                      ? [viewData.ponto_final_lat, viewData.ponto_final_lng]
                      : null
                  }
                />
              </div>
              <div className="space-y-3">
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
                ["Ponto A (início)", viewData.endereco_ponto_a],
                ["Ponto B (final)", viewData.endereco_ponto_b],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right max-w-[60%]">{(val as string) || "—"}</span>
                </div>
              ))}
              </div>
            </div>
          )}
          {editMode && editForm && (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Trajeto no mapa</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Edite os endereços abaixo e clique em "Plotar" no mapa, ou clique no mapa para reposicionar os pontos.
                </p>
                <PvsMap
                  onChange={handleMapChange}
                  enderecoA={editForm.endereco_ponto_a}
                  enderecoB={editForm.endereco_ponto_b}
                  initialStart={
                    editForm.ponto_inicial_lat && editForm.ponto_inicial_lng
                      ? [editForm.ponto_inicial_lat, editForm.ponto_inicial_lng]
                      : null
                  }
                  initialEnd={
                    editForm.ponto_final_lat && editForm.ponto_final_lng
                      ? [editForm.ponto_final_lat, editForm.ponto_final_lng]
                      : null
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Nome do Tutor *</Label>
                  <Input value={editForm.nome_tutor || ""} onChange={e => updateField("nome_tutor", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Documento</Label>
                  <Input value={editForm.documento_tutor || ""} onChange={e => updateField("documento_tutor", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Contato</Label>
                  <Input value={editForm.contato_tutor || ""} onChange={e => updateField("contato_tutor", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>E-mail</Label>
                  <Input type="email" value={editForm.email_tutor || ""} onChange={e => updateField("email_tutor", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>OPM</Label>
                  <Input value={editForm.opm || ""} onChange={e => updateField("opm", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Cia PM</Label>
                  <Input value={editForm.cia_pm || ""} onChange={e => updateField("cia_pm", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Modalidade</Label>
                  <Select value={editForm.modalidade || ""} onValueChange={v => updateField("modalidade", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {MODALIDADES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Cidade</Label>
                  <Input value={editForm.cidade || ""} onChange={e => updateField("cidade", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Ano de Início</Label>
                  <Input
                    type="number"
                    value={editForm.ano_inicio || ""}
                    onChange={e => updateField("ano_inicio", e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Ponto A — Início do trajeto</Label>
                  <Input value={editForm.endereco_ponto_a || ""} onChange={e => updateField("endereco_ponto_a", e.target.value)} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Ponto B — Final do trajeto</Label>
                  <Input value={editForm.endereco_ponto_b || ""} onChange={e => updateField("endereco_ponto_b", e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={saveEdit} disabled={saving} className="flex-1 gap-2">
                  <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar alterações"}
                </Button>
                <Button variant="outline" onClick={cancelEdit} disabled={saving} className="gap-2">
                  <X className="w-4 h-4" /> Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

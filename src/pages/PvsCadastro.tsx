import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, MapPin } from "lucide-react";
import PvsMap from "@/components/PvsMap";

const MODALIDADES = ["Residencial", "Comercial", "Rural", "Escolar", "Mista"];

export default function PvsCadastro() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    opm: "",
    cia_pm: "",
    modalidade: "",
    cidade: "",
    ano_inicio: new Date().getFullYear(),
    nome_tutor: "",
    documento_tutor: "",
    contato_tutor: "",
    email_tutor: "",
    endereco: "",
    endereco_ponto_a: "",
    endereco_ponto_b: "",
    latitude: 0,
    longitude: 0,
    ponto_inicial_lat: 0,
    ponto_inicial_lng: 0,
    ponto_final_lat: 0,
    ponto_final_lng: 0,
  });

  const update = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));

  const handleMapChange = (data: {
    center: [number, number];
    start: [number, number] | null;
    end: [number, number] | null;
  }) => {
    setForm(p => ({
      ...p,
      latitude: data.center[0],
      longitude: data.center[1],
      ponto_inicial_lat: data.start?.[0] || 0,
      ponto_inicial_lng: data.start?.[1] || 0,
      ponto_final_lat: data.end?.[0] || 0,
      ponto_final_lng: data.end?.[1] || 0,
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.nome_tutor) {
      toast({ title: "Preencha o nome do tutor", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("pvs_cadastros").insert({
      user_id: user.id,
      ...form,
    });
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "PVS cadastrado com sucesso!" });
      navigate("/pvs");
    }
    setSaving(false);
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="text-2xl font-heading font-bold mb-6">Cadastrar Novo PVS</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do PVS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>OPM</Label>
                <Input value={form.opm} onChange={e => update("opm", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cia PM</Label>
                <Input value={form.cia_pm} onChange={e => update("cia_pm", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Modalidade</Label>
                <Select value={form.modalidade} onValueChange={v => update("modalidade", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {MODALIDADES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={form.cidade} onChange={e => update("cidade", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Ano de Início</Label>
                <Input type="number" value={form.ano_inicio} onChange={e => update("ano_inicio", parseInt(e.target.value))} />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-sm mb-3">Dados do Tutor</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Tutor *</Label>
                  <Input value={form.nome_tutor} onChange={e => update("nome_tutor", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Documento</Label>
                  <Input value={form.documento_tutor} onChange={e => update("documento_tutor", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Contato</Label>
                  <Input value={form.contato_tutor} onChange={e => update("contato_tutor", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email_tutor} onChange={e => update("email_tutor", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-sm mb-3">Trajeto do PVS</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Ponto A — Início do trajeto</Label>
                  <Input
                    value={form.endereco_ponto_a}
                    onChange={e => update("endereco_ponto_a", e.target.value)}
                    placeholder="Ex: Rua das Flores, 100 - Bairro, Cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ponto B — Final do trajeto</Label>
                  <Input
                    value={form.endereco_ponto_b}
                    onChange={e => update("endereco_ponto_b", e.target.value)}
                    placeholder="Ex: Rua das Flores, 500 - Bairro, Cidade"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Após preencher Ponto A e Ponto B, clique em "Plotar" no mapa ao lado para visualizar o trajeto.
                </p>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-base gap-2 mt-4">
              <Save className="w-5 h-5" /> {saving ? "Salvando..." : "Salvar PVS"}
            </Button>
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Localização no Mapa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Preencha os endereços de Ponto A e Ponto B e clique em "Plotar", ou clique manualmente no mapa para definir o ponto inicial (verde) e o ponto final (vermelho).
            </p>
            <PvsMap
              onChange={handleMapChange}
              enderecoA={form.endereco_ponto_a}
              enderecoB={form.endereco_ponto_b}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

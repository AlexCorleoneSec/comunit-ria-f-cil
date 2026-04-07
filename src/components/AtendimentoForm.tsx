import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ORIGENS = ["COPOM", "Delegacia", "Comunidade", "Escola", "Unidade PM", "Tribunal de Justiça", "Outros"];
const TIPOS_LOCAL = ["Residência", "Comércio", "Via Pública", "Escola", "Praça", "Condomínio", "Outros"];
const DEMANDAS = ["Vizinhança", "Familiar", "Comunitária", "Escolar", "Patrimonial", "Trabalhista", "Outros"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editData?: any;
}

export default function AtendimentoForm({ open, onClose, onSaved, editData }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mediadores, setMediadores] = useState<any[]>([]);

  const [form, setForm] = useState({
    origem_atendimento: "",
    data_fato: new Date().toISOString().split("T")[0],
    data_registro: new Date().toISOString().split("T")[0],
    tipo_local: "",
    demanda: "",
    endereco_ocorrencia: "",
    resumo_fato: "",
    observacoes: "",
    primeiro_mediador_id: "",
    segundo_mediador_id: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        origem_atendimento: editData.origem_atendimento || "",
        data_fato: editData.data_fato || "",
        data_registro: editData.data_registro || "",
        tipo_local: editData.tipo_local || "",
        demanda: editData.demanda || "",
        endereco_ocorrencia: editData.endereco_ocorrencia || "",
        resumo_fato: editData.resumo_fato || "",
        observacoes: editData.observacoes || "",
        primeiro_mediador_id: editData.primeiro_mediador_id || "",
        segundo_mediador_id: editData.segundo_mediador_id || "",
      });
    } else {
      setForm({
        origem_atendimento: "",
        data_fato: new Date().toISOString().split("T")[0],
        data_registro: new Date().toISOString().split("T")[0],
        tipo_local: "",
        demanda: "",
        endereco_ocorrencia: "",
        resumo_fato: "",
        observacoes: "",
        primeiro_mediador_id: "",
        segundo_mediador_id: "",
      });
    }
  }, [editData, open]);

  useEffect(() => {
    supabase.from("mediadores").select("id, nome, re").then(({ data }) => {
      if (data) setMediadores(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const payload = {
      ...form,
      user_id: user.id,
      primeiro_mediador_id: form.primeiro_mediador_id || null,
      segundo_mediador_id: form.segundo_mediador_id || null,
    };

    try {
      if (editData?.id) {
        const { error } = await supabase.from("atendimentos").update(payload).eq("id", editData.id);
        if (error) throw error;
        toast({ title: "Atendimento atualizado!" });
      } else {
        const { error } = await supabase.from("atendimentos").insert(payload);
        if (error) throw error;
        toast({ title: "Atendimento cadastrado!" });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Editar Atendimento" : "Novo Atendimento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origem do Atendimento *</Label>
              <Select value={form.origem_atendimento} onValueChange={v => update("origem_atendimento", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {ORIGENS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Local</Label>
              <Select value={form.tipo_local} onValueChange={v => update("tipo_local", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {TIPOS_LOCAL.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data do Fato *</Label>
              <Input type="date" value={form.data_fato} onChange={e => update("data_fato", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Data do Registro *</Label>
              <Input type="date" value={form.data_registro} onChange={e => update("data_registro", e.target.value)} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Demanda</Label>
              <Select value={form.demanda} onValueChange={v => update("demanda", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {DEMANDAS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Endereço da Ocorrência</Label>
              <Input value={form.endereco_ocorrencia} onChange={e => update("endereco_ocorrencia", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Resumo do Fato</Label>
              <Textarea rows={3} value={form.resumo_fato} onChange={e => update("resumo_fato", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Observações</Label>
              <Textarea rows={2} value={form.observacoes} onChange={e => update("observacoes", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>1º Mediador</Label>
              <Select value={form.primeiro_mediador_id} onValueChange={v => update("primeiro_mediador_id", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {mediadores.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.nome}{m.re ? ` (RE: ${m.re})` : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>2º Mediador</Label>
              <Select value={form.segundo_mediador_id} onValueChange={v => update("segundo_mediador_id", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {mediadores.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.nome}{m.re ? ` (RE: ${m.re})` : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading || !form.origem_atendimento}>
              {loading ? "Salvando..." : editData ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

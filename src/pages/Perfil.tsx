import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const POSTOS = [
  "Soldado PM", "Cabo PM", "3º Sargento PM", "2º Sargento PM", "1º Sargento PM",
  "Subtenente PM", "Aspirante a Oficial PM", "2º Tenente PM", "1º Tenente PM",
  "Capitão PM", "Major PM", "Tenente-Coronel PM", "Coronel PM",
];

export default function Perfil() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    if (!user) return;
    supabase.from("mediadores").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setProfile(data);
      setLoading(false);
    });
  }, [user]);

  const update = (field: string, value: string) => setProfile((prev: any) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("mediadores").update({
      opm: profile.opm,
      re: profile.re,
      posto_graduacao: profile.posto_graduacao,
      nome: profile.nome,
      email: profile.email,
      celular: profile.celular,
      telefone: profile.telefone,
      formacao: profile.formacao,
      status_credenciamento: profile.status_credenciamento,
      data_credenciamento: profile.data_credenciamento,
      cursos_certificacoes: profile.cursos_certificacoes,
      grande_comando: profile.grande_comando,
      batalhao: profile.batalhao,
      companhia: profile.companhia,
    }).eq("user_id", user.id);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado com sucesso!" });
    }
    setSaving(false);
  };

  if (loading) return <div className="page-container text-center py-12 text-muted-foreground">Carregando...</div>;

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold">Perfil do Mediador</h2>
        <Button onClick={handleSave} disabled={saving} className="gap-2 h-11">
          <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <Tabs defaultValue="pessoais">
        <TabsList>
          <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="credenciamento">Credenciamento</TabsTrigger>
        </TabsList>

        <TabsContent value="pessoais" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input value={profile.nome || ""} onChange={e => update("nome", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>RE</Label>
                  <Input value={profile.re || ""} onChange={e => update("re", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Posto/Graduação</Label>
                  <Select value={profile.posto_graduacao || ""} onValueChange={v => update("posto_graduacao", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {POSTOS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>OPM</Label>
                  <Input value={profile.opm || ""} onChange={e => update("opm", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" value={profile.email || ""} onChange={e => update("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Celular</Label>
                  <Input value={profile.celular || ""} onChange={e => update("celular", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={profile.telefone || ""} onChange={e => update("telefone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Formação</Label>
                  <Input value={profile.formacao || ""} onChange={e => update("formacao", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Grande Comando</Label>
                  <Input value={profile.grande_comando || ""} onChange={e => update("grande_comando", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Batalhão</Label>
                  <Input value={profile.batalhao || ""} onChange={e => update("batalhao", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Companhia (Cia PM)</Label>
                  <Input value={profile.companhia || ""} onChange={e => update("companhia", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credenciamento" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={profile.status_credenciamento || "ativo"} onValueChange={v => update("status_credenciamento", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de Credenciamento</Label>
                  <Input type="date" value={profile.data_credenciamento || ""} onChange={e => update("data_credenciamento", e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Cursos / Certificações</Label>
                  <Textarea rows={4} value={profile.cursos_certificacoes || ""} onChange={e => update("cursos_certificacoes", e.target.value)} placeholder="Liste os cursos e certificações..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

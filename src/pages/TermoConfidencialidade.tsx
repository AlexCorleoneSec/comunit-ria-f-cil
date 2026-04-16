import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, ScrollText } from "lucide-react";

export default function TermoConfidencialidade() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem("termo_aceito", "true");
    navigate("/menu");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <ScrollText className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-heading">Termo de Confidencialidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-5 text-sm leading-relaxed max-h-[40vh] overflow-y-auto border">
            <p>
              De acordo com o prescrito no § 1º do artigo 65 (no caso de servidor público da
              Administração Direta ou de Fundações) e do artigo 37 (no caso de pessoas físicas ou
              entidade privada), ambos do Decreto Estadual nº 58.052, de 16 de maio de 2012, me
              comprometo a guardar sigilo sobre todos os assuntos, documentos, dados, informações e
              atividades das quais tenha tomado conhecimento ou tido acesso em razão de minha atuação
              junto ao Sistema Órion, e ainda, tomar todas as medidas de segurança adequadas à
              proteção dos documentos sigilosos sob minha custódia.
            </p>
            <p className="mt-4">
              Declaro ainda, estar ciente da aplicação da legislação, especial e comum, sem prejuízo
              de outras sanções de natureza disciplinar que possam advir do não cumprimento do
              presente termo.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="aceite"
              checked={accepted}
              onCheckedChange={(v) => setAccepted(v === true)}
            />
            <label
              htmlFor="aceite"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Concordo com os termos acima
            </label>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!accepted}
            className="w-full h-12 text-base"
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

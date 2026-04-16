
CREATE TABLE public.pvs_cadastros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  opm TEXT,
  cia_pm TEXT,
  modalidade TEXT,
  cidade TEXT,
  ano_inicio INTEGER,
  nome_tutor TEXT NOT NULL,
  documento_tutor TEXT,
  contato_tutor TEXT,
  email_tutor TEXT,
  endereco TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  ponto_inicial_lat DOUBLE PRECISION,
  ponto_inicial_lng DOUBLE PRECISION,
  ponto_final_lat DOUBLE PRECISION,
  ponto_final_lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pvs_cadastros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all pvs" ON public.pvs_cadastros FOR SELECT USING (true);
CREATE POLICY "Users can insert own pvs" ON public.pvs_cadastros FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pvs" ON public.pvs_cadastros FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pvs" ON public.pvs_cadastros FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_pvs_cadastros_updated_at
  BEFORE UPDATE ON public.pvs_cadastros
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


CREATE TYPE public.status_credenciamento AS ENUM ('ativo', 'inativo');

CREATE TABLE public.mediadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  opm TEXT,
  re TEXT,
  posto_graduacao TEXT,
  nome TEXT NOT NULL,
  email TEXT,
  celular TEXT,
  telefone TEXT,
  formacao TEXT,
  status_credenciamento status_credenciamento DEFAULT 'ativo',
  data_credenciamento DATE,
  cursos_certificacoes TEXT,
  grande_comando TEXT,
  batalhao TEXT,
  companhia TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mediadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all mediadores" ON public.mediadores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own mediador" ON public.mediadores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mediador" ON public.mediadores FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.atendimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origem_atendimento TEXT NOT NULL,
  data_fato DATE NOT NULL,
  data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_local TEXT,
  demanda TEXT,
  endereco_ocorrencia TEXT,
  resumo_fato TEXT,
  observacoes TEXT,
  primeiro_mediador_id UUID REFERENCES public.mediadores(id),
  segundo_mediador_id UUID REFERENCES public.mediadores(id),
  status TEXT DEFAULT 'em_andamento',
  grande_comando TEXT,
  batalhao TEXT,
  companhia TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.atendimentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all atendimentos" ON public.atendimentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert atendimentos" ON public.atendimentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own atendimentos" ON public.atendimentos FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own atendimentos" ON public.atendimentos FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_mediadores_updated_at BEFORE UPDATE ON public.mediadores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_atendimentos_updated_at BEFORE UPDATE ON public.atendimentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.mediadores (user_id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

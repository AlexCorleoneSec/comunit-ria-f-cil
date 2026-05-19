ALTER TABLE public.pvs_cadastros
ADD COLUMN IF NOT EXISTS endereco_ponto_a text,
ADD COLUMN IF NOT EXISTS endereco_ponto_b text;
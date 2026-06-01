-- Tabela de leads do formulário de demonstração
-- Execute no SQL Editor do Supabase: https://app.supabase.com → SQL Editor

create table if not exists demo_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nome        text not null,
  empresa     text not null,
  whatsapp    text not null,
  email       text not null,
  segmento    text,
  atendentes  text,
  dificuldade text,
  origem      text
);

-- Habilitar Row Level Security
alter table demo_requests enable row level security;

-- Permitir apenas inserção pública (anon pode inserir, mas não ler)
create policy "Leads: inserção pública"
  on demo_requests
  for insert
  to anon
  with check (true);

-- Apenas autenticados podem ler os leads
create policy "Leads: leitura autenticada"
  on demo_requests
  for select
  to authenticated
  using (true);

-- RLS categorias: solo admin escribe, público lee
alter table public.categorias enable row level security;
drop policy if exists "categorias_update_auth" on public.categorias;
drop policy if exists "categorias_write_auth"  on public.categorias;
drop policy if exists "categorias_public_read" on public.categorias;

create policy if not exists "categorias select public"
  on public.categorias for select using (true);

create policy if not exists "categorias write admin"
  on public.categorias for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Unicidad por slug
create unique index if not exists categorias_slug_key on public.categorias(slug);

-- Insert de Turismo (idempotente)
insert into public.categorias (nombre, slug)
values ('Turismo', 'turismo')
on conflict (slug) do nothing;

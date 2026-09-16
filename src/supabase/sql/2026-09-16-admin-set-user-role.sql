-- Reemplaza para clientes el cambio de roles por email con una RPC basada en UUID.
-- No modifica los grants de UPDATE ni las policies RLS de public.profiles.

begin;

-- La RPC anterior queda disponible para service_role, pero deja de estar
-- expuesta a clientes anónimos o autenticados.
revoke execute
  on function public.promote_user(text, public.user_role)
  from public, anon, authenticated;

create or replace function public.admin_set_user_role(
  p_user_id uuid,
  p_role public.user_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_actor_id uuid;
  v_actor_role public.user_role;
  v_target_role public.user_role;
begin
  v_actor_id := auth.uid();

  if v_actor_id is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if p_user_id is null then
    raise exception 'Target user is required'
      using errcode = '22023';
  end if;

  if p_role is null then
    raise exception 'Target role is required'
      using errcode = '22023';
  end if;

  -- Rechaza actores no autorizados antes de que puedan adquirir un lock
  -- privilegiado mediante esta función SECURITY DEFINER.
  select profile.role
    into v_actor_role
  from public.profiles as profile
  where profile.id = v_actor_id;

  if v_actor_role is distinct from 'admin'::public.user_role then
    raise exception 'Admin role required'
      using errcode = '42501';
  end if;

  if p_user_id = v_actor_id then
    raise exception 'Administrators cannot change their own role'
      using errcode = '22023';
  end if;

  -- Serializa los cambios de profiles durante la autorización, el control
  -- del último admin y el UPDATE. También evita carreras con otros caminos
  -- que intenten actualizar la tabla en paralelo.
  lock table public.profiles in share row exclusive mode;

  -- Revalida al actor bajo el lock: pudo haber sido degradado entre la primera
  -- comprobación y la adquisición del bloqueo.
  select profile.role
    into v_actor_role
  from public.profiles as profile
  where profile.id = v_actor_id;

  if v_actor_role is distinct from 'admin'::public.user_role then
    raise exception 'Admin role required'
      using errcode = '42501';
  end if;

  select profile.role
    into v_target_role
  from public.profiles as profile
  where profile.id = p_user_id;

  if not found then
    raise exception 'Target profile not found'
      using errcode = 'P0002';
  end if;

  if
    v_target_role = 'admin'::public.user_role
    and p_role <> 'admin'::public.user_role
    and (
      select count(*)
      from public.profiles as profile
      where profile.role = 'admin'::public.user_role
    ) <= 1
  then
    raise exception 'Cannot demote the last administrator'
      using errcode = '23514';
  end if;

  update public.profiles
  set role = p_role
  where id = p_user_id;
end;
$function$;

alter function public.admin_set_user_role(uuid, public.user_role)
  owner to postgres;

-- Las funciones nuevas reciben EXECUTE de PUBLIC por defecto. Se limpia todo
-- acceso de los roles de API y se habilita únicamente a authenticated.
revoke all
  on function public.admin_set_user_role(uuid, public.user_role)
  from public, anon, authenticated, service_role;

grant execute
  on function public.admin_set_user_role(uuid, public.user_role)
  to authenticated;

commit;

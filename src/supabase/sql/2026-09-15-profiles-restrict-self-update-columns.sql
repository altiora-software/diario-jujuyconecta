-- Impide que usuarios autenticados escalen privilegios modificando profiles.role.
-- La policy profiles_self_update sigue limitando el UPDATE a la fila propia.

revoke update on table public.profiles from authenticated;

grant update (full_name, avatar_url)
  on table public.profiles
  to authenticated;

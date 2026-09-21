-- Removing another member or changing their role needs to update a row the
-- caller doesn't own (profiles' own RLS only lets you update yourself), so —
-- same reasoning as provision_family — this runs as a narrow, checked
-- SECURITY DEFINER function instead of widening the profiles RLS policy.
create function remove_family_member(p_member_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_family uuid;
  v_caller_role text;
  v_target_family uuid;
begin
  select family_id, role into v_caller_family, v_caller_role from profiles where id = auth.uid();
  select family_id into v_target_family from profiles where id = p_member_id;

  if v_caller_role <> 'admin' or v_caller_family is null or v_caller_family <> v_target_family then
    raise exception 'Apenas administradores podem remover membros da família.';
  end if;

  if p_member_id = auth.uid() then
    raise exception 'Você não pode remover a si mesmo(a).';
  end if;

  update profiles set family_id = null, role = 'member' where id = p_member_id;
end;
$$;

create function set_family_member_role(p_member_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_family uuid;
  v_caller_role text;
  v_target_family uuid;
begin
  if p_role not in ('admin', 'member') then
    raise exception 'Papel inválido.';
  end if;

  select family_id, role into v_caller_family, v_caller_role from profiles where id = auth.uid();
  select family_id into v_target_family from profiles where id = p_member_id;

  if v_caller_role <> 'admin' or v_caller_family is null or v_caller_family <> v_target_family then
    raise exception 'Apenas administradores podem alterar papéis.';
  end if;

  update profiles set role = p_role where id = p_member_id;
end;
$$;

revoke execute on function remove_family_member(uuid) from public, anon;
grant execute on function remove_family_member(uuid) to authenticated;
revoke execute on function set_family_member_role(uuid, text) from public, anon;
grant execute on function set_family_member_role(uuid, text) to authenticated;

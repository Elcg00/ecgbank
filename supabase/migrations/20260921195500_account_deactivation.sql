alter table profiles add column deactivated_at timestamptz;

-- An admin deactivating/reactivating another member's access needs to
-- update a row they don't own (same reasoning as remove_family_member /
-- set_family_member_role: profiles' own RLS only allows self-updates).
create function deactivate_family_member(p_member_id uuid, p_deactivated boolean)
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
    raise exception 'Apenas administradores podem desativar o acesso de membros.';
  end if;

  if p_member_id = auth.uid() then
    raise exception 'Use a opção em Configurações para desativar sua própria conta.';
  end if;

  update profiles set deactivated_at = case when p_deactivated then now() else null end
    where id = p_member_id;
end;
$$;

revoke execute on function deactivate_family_member(uuid, boolean) from public, anon;
grant execute on function deactivate_family_member(uuid, boolean) to authenticated;

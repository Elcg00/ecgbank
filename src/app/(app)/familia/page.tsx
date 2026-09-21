import { BackHeader } from "@/components/app/BackHeader";
import { PageHeader } from "@/components/app/PageHeader";
import { getSessionContext } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Monogram } from "@/components/ui/Monogram";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { inviteMember, revokeInvite, removeMember, toggleMemberRole, toggleMemberActive } from "./actions";

export default async function FamiliaPage() {
  const { supabase, profile } = await getSessionContext();

  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role, avatar_color, deactivated_at")
      .eq("family_id", profile.family_id)
      .order("created_at"),
    supabase
      .from("family_invites")
      .select("id, email")
      .eq("family_id", profile.family_id)
      .eq("status", "pending"),
  ]);

  const isAdmin = profile.role === "admin";

  return (
    <div>
      <BackHeader href="/mais" label="Mais" />
      <PageHeader title="Família" name={profile.full_name} avatarColor={profile.avatar_color} />
      <h6 className="mb-3 text-ink-muted">Família / Compartilhamento</h6>

      <div className="mb-4 flex flex-col gap-3 md:grid md:grid-cols-2">
        {(members ?? []).map((m) => {
          const isSelf = m.id === profile.id;
          return (
            <Card key={m.id} className="flex items-center gap-3">
              <Monogram label={m.full_name || "Membro"} size="lg" color={m.avatar_color} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">
                  {m.full_name || "Sem nome"} {isSelf && <span className="text-ink-muted">(você)</span>}
                </p>
                <p className="text-[13px] text-ink-muted">
                  {m.role === "admin" ? "Administrador(a) — edita tudo" : "Pode lançar e ver tudo"}
                </p>
                {m.deactivated_at && (
                  <p className="text-[12px] font-semibold text-negative">Acesso desativado</p>
                )}
              </div>
              {isAdmin && !isSelf && (
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <form action={toggleMemberRole}>
                    <input type="hidden" name="member_id" value={m.id} />
                    <input type="hidden" name="new_role" value={m.role === "admin" ? "member" : "admin"} />
                    <button type="submit" className="text-[12px] font-semibold text-accent-ink">
                      {m.role === "admin" ? "Tornar membro" : "Tornar admin"}
                    </button>
                  </form>
                  <form action={toggleMemberActive}>
                    <input type="hidden" name="member_id" value={m.id} />
                    <input type="hidden" name="deactivate" value={m.deactivated_at ? "false" : "true"} />
                    <button type="submit" className="text-[12px] font-semibold text-warning">
                      {m.deactivated_at ? "Reativar acesso" : "Desativar acesso"}
                    </button>
                  </form>
                  <ConfirmForm
                    action={removeMember}
                    confirmMessage={`Remover ${m.full_name || "esse membro"} da família?`}
                  >
                    <input type="hidden" name="member_id" value={m.id} />
                    <button type="submit" className="text-[12px] font-semibold text-negative">
                      Remover
                    </button>
                  </ConfirmForm>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {(invites ?? []).map((invite) => (
        <Card key={invite.id} className="mb-4 flex items-center justify-between gap-3">
          <p className="text-[14px] text-ink-muted">
            Convite enviado para <span className="font-semibold text-ink">{invite.email}</span>
          </p>
          <form action={revokeInvite}>
            <input type="hidden" name="invite_id" value={invite.id} />
            <button type="submit" className="text-[13px] font-semibold text-negative">
              Cancelar
            </button>
          </form>
        </Card>
      ))}

      <Card className="mb-4">
        <h5 className="mb-3">Convidar alguém</h5>
        <form action={inviteMember} className="flex items-end gap-2">
          <Field label="E-mail" name="email" type="email" required placeholder="mae@email.com" />
          <Button type="submit">+ Convidar</Button>
        </form>
      </Card>

      <p className="text-[13px] text-ink-muted">
        Compartilhado entre todos da família: grupos de orçamento, contas, cartão, dívidas e metas
        compartilhadas. Lançamentos marcados como individuais aparecem só para quem lançou.
      </p>
    </div>
  );
}

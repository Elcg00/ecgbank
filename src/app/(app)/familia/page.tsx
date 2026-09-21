import { BackHeader } from "@/components/app/BackHeader";
import { PageHeader } from "@/components/app/PageHeader";
import { getSessionContext } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Monogram } from "@/components/ui/Monogram";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { inviteMember, revokeInvite } from "./actions";

export default async function FamiliaPage() {
  const { supabase, profile } = await getSessionContext();

  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("family_id", profile.family_id)
      .order("created_at"),
    supabase
      .from("family_invites")
      .select("id, email")
      .eq("family_id", profile.family_id)
      .eq("status", "pending"),
  ]);

  return (
    <div>
      <BackHeader href="/mais" label="Mais" />
      <PageHeader title="Família" name={profile.full_name} />
      <h6 className="mb-3 text-ink-muted">Família / Compartilhamento</h6>

      <div className="mb-4 flex flex-col gap-3 md:grid md:grid-cols-2">
        {(members ?? []).map((m) => (
          <Card key={m.id} className="flex items-center gap-3">
            <Monogram label={m.full_name || "Membro"} size="lg" />
            <div>
              <p className="font-semibold text-ink">{m.full_name || "Sem nome"}</p>
              <p className="text-[13px] text-ink-muted">
                {m.role === "admin" ? "Administrador(a) — edita tudo" : "Pode lançar e ver tudo"}
              </p>
            </div>
          </Card>
        ))}
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

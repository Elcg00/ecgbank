import { BackHeader } from "@/components/app/BackHeader";
import { PageHeader } from "@/components/app/PageHeader";
import { getSessionContext } from "@/lib/session";
import { signOut } from "@/app/(auth)/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NameForm } from "./NameForm";
import { PasswordForm } from "./PasswordForm";

export default async function ConfiguracoesPage() {
  const { supabase, profile, email } = await getSessionContext();
  const { data: family } = await supabase
    .from("families")
    .select("name")
    .eq("id", profile.family_id)
    .single();

  return (
    <div>
      <BackHeader href="/mais" label="Mais" />
      <PageHeader title="Configurações" name={profile.full_name} />

      <div className="flex flex-col gap-4 md:max-w-lg">
        <Card>
          <h5 className="mb-3">Seus dados</h5>
          <p className="mb-3 text-[13px] text-ink-muted">{email}</p>
          <NameForm defaultName={profile.full_name} />
        </Card>

        <Card>
          <h5 className="mb-3">Senha</h5>
          <PasswordForm />
        </Card>

        <Card>
          <h5 className="mb-1">Família</h5>
          <p className="text-[14px] text-ink-muted">
            {family?.name ?? "Sua família"} ·{" "}
            {profile.role === "admin" ? "Você é administrador(a)" : "Você é membro"}
          </p>
        </Card>

        <Card>
          <h5 className="mb-3">Sair</h5>
          <form action={signOut}>
            <Button type="submit" variant="secondary" className="w-full">
              Sair da conta
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

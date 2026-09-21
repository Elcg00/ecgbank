import { BackHeader } from "@/components/app/BackHeader";
import { PageHeader } from "@/components/app/PageHeader";
import { getSessionContext } from "@/lib/session";
import { signOut } from "@/app/(auth)/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmForm } from "@/components/ui/ConfirmForm";
import { centsToInputValue } from "@/lib/format";
import { normalizePreferences } from "@/lib/preferences";
import { NameForm } from "./NameForm";
import { PasswordForm } from "./PasswordForm";
import { IncomeForm } from "./IncomeForm";
import { PreferencesForm } from "./PreferencesForm";
import { AvatarColorForm } from "./AvatarColorForm";
import { deactivateAccount } from "./actions";

export default async function ConfiguracoesPage() {
  const { supabase, profile, email } = await getSessionContext();
  const prefs = normalizePreferences(profile);
  const [{ data: family }, { data: onboarding }] = await Promise.all([
    supabase.from("families").select("name").eq("id", profile.family_id).single(),
    supabase
      .from("onboarding_answers")
      .select("monthly_income_cents")
      .eq("user_id", profile.id)
      .maybeSingle(),
  ]);

  return (
    <div>
      <BackHeader href="/mais" label="Mais" />
      <PageHeader title="Configurações" name={profile.full_name} avatarColor={profile.avatar_color} />

      <div className="flex flex-col gap-4 md:max-w-lg">
        <Card>
          <h5 className="mb-3">Seus dados</h5>
          <p className="mb-3 text-[13px] text-ink-muted">{email}</p>
          <NameForm defaultName={profile.full_name} />
        </Card>

        <Card>
          <h5 className="mb-3">Cor do avatar</h5>
          <AvatarColorForm name={profile.full_name} defaultColor={profile.avatar_color} />
        </Card>

        <Card>
          <h5 className="mb-3">Senha</h5>
          <PasswordForm />
        </Card>

        <Card>
          <h5 className="mb-3">Renda</h5>
          <IncomeForm defaultIncome={centsToInputValue(onboarding?.monthly_income_cents ?? 0)} />
        </Card>

        <Card>
          <h5 className="mb-3">Aparência</h5>
          <PreferencesForm
            defaultTheme={prefs.theme_preference}
            defaultAccent={prefs.accent_theme}
            defaultHeading={prefs.heading_style}
          />
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

        <Card>
          <h5 className="mb-1">Desativar conta</h5>
          <p className="mb-3 text-[13px] text-ink-muted">
            Você deixa de conseguir entrar até um administrador da família reativar seu acesso. Seus
            dados continuam guardados.
          </p>
          <ConfirmForm
            action={deactivateAccount}
            confirmMessage="Desativar sua conta? Você não conseguirá mais entrar até um administrador da família reativar seu acesso."
          >
            <Button type="submit" variant="secondary" className="w-full text-negative">
              Desativar minha conta
            </Button>
          </ConfirmForm>
        </Card>
      </div>
    </div>
  );
}

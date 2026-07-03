import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/services/adminAuthService";
import { useAdminAuth } from "@/context/AdminAuthContext";
import MonogramDivider from "@/components/MonogramDivider";
import { useSEO } from "@/hooks/useSEO";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha muito curta"),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLogin() {
  useSEO({ title: "Painel Administrativo" });
  const { setSession } = useAdminAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const session = await adminLogin(values.email, values.senha);
      setSession(session);
      navigate("/admin");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Falha ao entrar.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 dark:bg-ink">
      <MonogramDivider />
      <h1 className="mt-6 font-display text-3xl text-ink dark:text-paper">Painel Administrativo</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="email" className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            {...register("email")}
            className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2 font-serif text-ink outline-none dark:text-paper dark:border-paper/20"
          />
          {errors.email && <p className="mt-1 text-sm text-wine">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="senha" className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            {...register("senha")}
            className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2 font-serif text-ink outline-none dark:text-paper dark:border-paper/20"
          />
          {errors.senha && <p className="mt-1 text-sm text-wine">{errors.senha.message}</p>}
        </div>

        {serverError && <p className="text-center text-sm text-wine">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm border border-wine bg-wine py-3 font-caption text-sm uppercase tracking-[0.15em] text-paper hover:bg-wine-light disabled:opacity-60"
        >
          {isSubmitting ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}

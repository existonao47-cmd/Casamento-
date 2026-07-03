import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Download, KeyRound } from "lucide-react";
import {
  listFamilies,
  createFamily,
  deleteFamily,
  listGuests,
  createGuest,
  deleteGuest,
  generateInviteCode,
  listInviteCodes,
} from "@/services/adminDataService";
import { exportGuestsToExcel } from "@/services/exportService";
import { useSEO } from "@/hooks/useSEO";

const familySchema = z.object({ nome: z.string().min(2, "Nome da família obrigatório") });
type FamilyForm = z.infer<typeof familySchema>;

const guestSchema = z.object({
  familia_id: z.string().min(1, "Selecione a família"),
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email().optional().or(z.literal("")),
  telefone: z.string().optional(),
});
type GuestForm = z.infer<typeof guestSchema>;

const codeSchema = z.object({
  familia_id: z.string().min(1, "Selecione a família"),
  quantidade_maxima: z.coerce.number().min(1).max(20),
});
type CodeForm = z.infer<typeof codeSchema>;

export default function Convidados() {
  useSEO({ title: "Convidados & Famílias" });
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: families = [] } = useQuery({ queryKey: ["admin-familias"], queryFn: listFamilies });
  const { data: guests = [] } = useQuery({ queryKey: ["admin-convidados"], queryFn: listGuests });
  const { data: codes = [] } = useQuery({ queryKey: ["admin-codigos"], queryFn: listInviteCodes });

  const familyForm = useForm<FamilyForm>({ resolver: zodResolver(familySchema) });
  const guestForm = useForm<GuestForm>({ resolver: zodResolver(guestSchema) });
  const codeForm = useForm<CodeForm>({ resolver: zodResolver(codeSchema) });

  async function onCreateFamily(values: FamilyForm) {
    await createFamily(values.nome);
    familyForm.reset();
    await queryClient.invalidateQueries({ queryKey: ["admin-familias"] });
  }

  async function onCreateGuest(values: GuestForm) {
    await createGuest({
      familia_id: values.familia_id,
      nome: values.nome,
      email: values.email || null,
      telefone: values.telefone || null,
    });
    guestForm.reset();
    await queryClient.invalidateQueries({ queryKey: ["admin-convidados"] });
  }

  async function onGenerateCode(values: CodeForm) {
    await generateInviteCode(values.familia_id, values.quantidade_maxima);
    codeForm.reset();
    await queryClient.invalidateQueries({ queryKey: ["admin-codigos"] });
  }

  const familyById = new Map(families.map((f) => [f.id, f.nome]));
  const filteredGuests = guests.filter((g) => g.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink dark:text-paper">Convidados & Famílias</h1>
        <button
          type="button"
          onClick={() => exportGuestsToExcel(guests, families)}
          className="flex items-center gap-2 rounded-sm border border-ink/20 px-4 py-2 font-caption text-xs uppercase tracking-wider text-ink dark:text-paper dark:border-paper/20"
        >
          <Download size={14} /> Exportar Excel
        </button>
      </div>

      {/* Famílias */}
      <section>
        <h2 className="font-display text-2xl text-ink dark:text-paper">Famílias</h2>
        <form onSubmit={familyForm.handleSubmit(onCreateFamily)} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Nome da família"
            {...familyForm.register("nome")}
            className="flex-1 rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
          />
          <button type="submit" className="rounded-sm border border-wine bg-wine px-4 py-2 font-caption text-xs uppercase tracking-wider text-paper">
            Cadastrar
          </button>
        </form>
        {familyForm.formState.errors.nome && (
          <p className="mt-1 text-sm text-wine">{familyForm.formState.errors.nome.message}</p>
        )}

        <ul className="mt-4 divide-y divide-ink/10 dark:divide-paper/10">
          {families.map((family) => (
            <li key={family.id} className="flex items-center justify-between py-2">
              <span className="font-serif text-ink dark:text-paper">{family.nome}</span>
              <button
                type="button"
                onClick={async () => {
                  await deleteFamily(family.id);
                  await queryClient.invalidateQueries({ queryKey: ["admin-familias"] });
                }}
                aria-label={`Excluir família ${family.nome}`}
              >
                <Trash2 size={16} className="text-ink-light hover:text-wine dark:text-paper/50" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Gerar código de convite */}
      <section>
        <h2 className="font-display text-2xl text-ink dark:text-paper">Gerar Código de Convite</h2>
        <form onSubmit={codeForm.handleSubmit(onGenerateCode)} className="mt-4 flex flex-wrap gap-2">
          <select
            {...codeForm.register("familia_id")}
            className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink dark:text-paper dark:border-paper/20"
          >
            <option value="">Selecione a família</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={20}
            placeholder="Qtd. máxima de convidados"
            {...codeForm.register("quantidade_maxima")}
            className="w-56 rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
          />
          <button type="submit" className="flex items-center gap-2 rounded-sm border border-wine bg-wine px-4 py-2 font-caption text-xs uppercase tracking-wider text-paper">
            <KeyRound size={14} /> Gerar Código
          </button>
        </form>

        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {codes.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-sm border border-ink/10 px-3 py-2 font-caption text-sm dark:border-paper/10"
            >
              <span className="text-ink dark:text-paper">{c.codigo}</span>
              <span className={c.utilizado ? "text-ink-light/50" : "text-wine dark:text-sunflower"}>
                {c.utilizado ? "usado" : "disponível"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Convidados */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink dark:text-paper">Convidados</h2>
          <input
            type="search"
            placeholder="Pesquisar convidado…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
          />
        </div>

        <form onSubmit={guestForm.handleSubmit(onCreateGuest)} className="mt-4 flex flex-wrap gap-2">
          <select
            {...guestForm.register("familia_id")}
            className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink dark:text-paper dark:border-paper/20"
          >
            <option value="">Família</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nome"
            {...guestForm.register("nome")}
            className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
          />
          <input
            type="email"
            placeholder="E-mail (opcional)"
            {...guestForm.register("email")}
            className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
          />
          <button type="submit" className="rounded-sm border border-wine bg-wine px-4 py-2 font-caption text-xs uppercase tracking-wider text-paper">
            Cadastrar
          </button>
        </form>

        <table className="mt-6 w-full text-left font-serif text-sm">
          <thead>
            <tr className="border-b border-ink/10 dark:border-paper/10">
              <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Nome</th>
              <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Família</th>
              <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">E-mail</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="border-b border-ink/5 dark:border-paper/5">
                <td className="py-2 text-ink dark:text-paper">{guest.nome}</td>
                <td className="py-2 text-ink-light dark:text-paper/70">{familyById.get(guest.familia_id)}</td>
                <td className="py-2 text-ink-light dark:text-paper/70">{guest.email ?? "-"}</td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteGuest(guest.id);
                      await queryClient.invalidateQueries({ queryKey: ["admin-convidados"] });
                    }}
                    aria-label={`Excluir ${guest.nome}`}
                  >
                    <Trash2 size={16} className="text-ink-light hover:text-wine dark:text-paper/50" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
